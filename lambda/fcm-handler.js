/**
 * @file lambda/fcm-handler.js
 * @description FCM 푸시 알림 Lambda 핸들러
 *
 * 기능:
 * - FCM 토큰 등록/업데이트
 * - 푸시 알림 전송 (FCM V1 API)
 *
 * 환경 변수:
 * - FCM_PROJECT_ID: Firebase 프로젝트 ID
 * - FCM_CLIENT_EMAIL: 서비스 계정 이메일
 * - FCM_PRIVATE_KEY: 서비스 계정 비공개 키
 * - FCM_TOKENS_TABLE: DynamoDB 테이블 이름
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const https = require('https');
const crypto = require('crypto');

// DynamoDB 클라이언트
const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(ddbClient);

// 테이블 이름
const FCM_TOKENS_TABLE = process.env.FCM_TOKENS_TABLE || 'ai-english-fcm-tokens';

// Firebase 설정
const FCM_CONFIG = {
  projectId: process.env.FCM_PROJECT_ID || 'ai-english-call',
  clientEmail: process.env.FCM_CLIENT_EMAIL,
  privateKey: process.env.FCM_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

/**
 * Google OAuth2 액세스 토큰 생성
 */
async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const expiry = now + 3600;

  // JWT Header
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  // JWT Payload
  const payload = {
    iss: FCM_CONFIG.clientEmail,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: expiry,
  };

  // Base64url encode
  const base64UrlEncode = (obj) => {
    return Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  const headerEncoded = base64UrlEncode(header);
  const payloadEncoded = base64UrlEncode(payload);
  const signatureInput = `${headerEncoded}.${payloadEncoded}`;

  // Sign with RSA-SHA256
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signatureInput);
  const signature = sign
    .sign(FCM_CONFIG.privateKey, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const jwt = `${signatureInput}.${signature}`;

  // Exchange JWT for access token
  return new Promise((resolve, reject) => {
    const postData = `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`;

    const options = {
      hostname: 'oauth2.googleapis.com',
      port: 443,
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.access_token) {
            resolve(response.access_token);
          } else {
            reject(new Error(`Token error: ${data}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/**
 * FCM V1 API로 푸시 알림 전송
 */
async function sendFcmMessage(fcmToken, title, body, data = {}) {
  const accessToken = await getAccessToken();

  const message = {
    message: {
      token: fcmToken,
      notification: {
        title,
        body,
      },
      data: {
        ...data,
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'ai-speaking-partner',
        },
      },
    },
  };

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(message);

    const options = {
      hostname: 'fcm.googleapis.com',
      port: 443,
      path: `/v1/projects/${FCM_CONFIG.projectId}/messages:send`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`FCM Error ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/**
 * FCM 토큰 등록/업데이트
 */
async function registerToken(deviceId, fcmToken, platform) {
  const params = {
    TableName: FCM_TOKENS_TABLE,
    Item: {
      deviceId,
      fcmToken,
      platform,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  };

  await docClient.send(new PutCommand(params));

  return { success: true, message: 'Token registered' };
}

/**
 * 디바이스 ID로 FCM 토큰 조회
 */
async function getTokenByDeviceId(deviceId) {
  const params = {
    TableName: FCM_TOKENS_TABLE,
    Key: { deviceId },
  };

  const result = await docClient.send(new GetCommand(params));
  return result.Item;
}

/**
 * 특정 디바이스에 푸시 알림 전송
 */
async function sendPushToDevice(deviceId, title, body, data = {}) {
  const tokenRecord = await getTokenByDeviceId(deviceId);

  if (!tokenRecord || !tokenRecord.fcmToken) {
    return { success: false, error: 'Device token not found' };
  }

  try {
    const result = await sendFcmMessage(tokenRecord.fcmToken, title, body, data);
    return { success: true, messageId: result.name };
  } catch (error) {
    console.error('FCM send error:', error);

    // 토큰이 만료된 경우 삭제
    if (error.message.includes('UNREGISTERED') || error.message.includes('INVALID_ARGUMENT')) {
      await docClient.send(new DeleteCommand({
        TableName: FCM_TOKENS_TABLE,
        Key: { deviceId },
      }));
    }

    return { success: false, error: error.message };
  }
}

/**
 * Lambda 핸들러
 */
exports.handler = async (event) => {
  const body = typeof event.body === 'string' ? JSON.parse(event.body) : event;
  const { action } = body;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  try {
    let result;

    switch (action) {
      case 'register_fcm_token': {
        const { deviceId, fcmToken, platform } = body;
        if (!deviceId || !fcmToken) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'deviceId and fcmToken are required' }),
          };
        }
        result = await registerToken(deviceId, fcmToken, platform || 'android');
        break;
      }

      case 'send_push': {
        const { deviceId, title, body: messageBody, data } = body;
        if (!deviceId || !title) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'deviceId and title are required' }),
          };
        }
        result = await sendPushToDevice(deviceId, title, messageBody || '', data || {});
        break;
      }

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: `Unknown action: ${action}` }),
        };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

/**
 * 분석 완료 후 푸시 알림 전송 (다른 Lambda에서 호출)
 */
exports.sendAnalysisNotification = async (deviceId, sessionId) => {
  return sendPushToDevice(
    deviceId,
    '📊 AI 분석 리포트가 도착했어요!',
    '대화 분석 결과를 확인해보세요.',
    {
      type: 'analysis_report',
      sessionId,
    }
  );
};

/**
 * 예약 전화 알림 전송 (CloudWatch Events에서 호출)
 */
exports.sendScheduledCallNotification = async (deviceId) => {
  return sendPushToDevice(
    deviceId,
    '📞 AI 전화 시간이에요!',
    '지금 AI 튜터와 영어 회화를 시작해보세요.',
    {
      type: 'incoming_call',
    }
  );
};
