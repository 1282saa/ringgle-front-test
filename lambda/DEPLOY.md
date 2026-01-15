# FCM 푸시 알림 Lambda 배포 가이드

## 1. DynamoDB 테이블 생성

AWS Console에서 DynamoDB 테이블 생성:

- **테이블 이름**: `ai-english-fcm-tokens`
- **파티션 키**: `deviceId` (String)

## 2. Lambda 함수 생성

### 방법 A: AWS Console에서 직접 생성

1. AWS Lambda Console 접속
2. "함수 생성" 클릭
3. 설정:
   - 함수 이름: `ai-english-fcm-handler`
   - 런타임: Node.js 20.x
   - 아키텍처: x86_64

4. 코드 업로드:
   - `fcm-handler.js` 내용을 Lambda 에디터에 붙여넣기

5. 환경 변수 설정:
   ```
   FCM_PROJECT_ID=ai-english-call
   FCM_CLIENT_EMAIL=firebase-adminsdk-fbsvc@ai-english-call.iam.gserviceaccount.com
   FCM_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...(전체 키)...\n-----END PRIVATE KEY-----\n
   FCM_TOKENS_TABLE=ai-english-fcm-tokens
   ```

6. IAM 권한 추가 (Lambda 실행 역할에):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "dynamodb:PutItem",
           "dynamodb:GetItem",
           "dynamodb:DeleteItem"
         ],
         "Resource": "arn:aws:dynamodb:*:*:table/ai-english-fcm-tokens"
       }
     ]
   }
   ```

### 방법 B: 기존 Lambda에 코드 추가

기존 `ai-english-chat` Lambda에 FCM 핸들러를 통합:

1. 기존 Lambda 코드에 `fcm-handler.js`의 함수들 추가
2. `action` 분기에 `register_fcm_token`, `send_push` 추가
3. 환경 변수 추가
4. DynamoDB 권한 추가

## 3. API Gateway 연결 (선택)

별도의 API Gateway를 만들거나, 기존 엔드포인트에 연결합니다.

기존 API Gateway를 사용하는 경우, Lambda 통합을 업데이트하여
새로운 액션들을 처리하도록 합니다.

## 4. 테스트

### 토큰 등록 테스트
```bash
curl -X POST https://YOUR_API_GATEWAY_URL/prod/chat \
  -H "Content-Type: application/json" \
  -d '{
    "action": "register_fcm_token",
    "deviceId": "test-device-123",
    "fcmToken": "YOUR_FCM_TOKEN",
    "platform": "android"
  }'
```

### 푸시 전송 테스트
```bash
curl -X POST https://YOUR_API_GATEWAY_URL/prod/chat \
  -H "Content-Type: application/json" \
  -d '{
    "action": "send_push",
    "deviceId": "test-device-123",
    "title": "테스트 알림",
    "body": "푸시 알림이 정상 작동합니다!"
  }'
```

## 환경 변수 상세

| 변수명 | 설명 | 예시 |
|--------|------|------|
| FCM_PROJECT_ID | Firebase 프로젝트 ID | ai-english-call |
| FCM_CLIENT_EMAIL | 서비스 계정 이메일 | firebase-adminsdk-xxx@project.iam.gserviceaccount.com |
| FCM_PRIVATE_KEY | 서비스 계정 비공개 키 | -----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n |
| FCM_TOKENS_TABLE | DynamoDB 테이블 이름 | ai-english-fcm-tokens |

## 주의사항

1. **FCM_PRIVATE_KEY**는 줄바꿈을 `\n`으로 변환해서 저장해야 합니다.
2. Lambda 타임아웃을 최소 30초로 설정하세요.
3. 프로덕션에서는 AWS Secrets Manager 사용을 권장합니다.
