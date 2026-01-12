import json
import boto3
import re
import base64

# AWS 클라이언트
bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')
polly = boto3.client('polly', region_name='us-east-1')
transcribe = boto3.client('transcribe', region_name='us-east-1')
s3 = boto3.client('s3', region_name='us-east-1')

# S3 버킷 (Transcribe용)
S3_BUCKET = 'eng-learning-audio'

# 모델 설정 (베타용 저비용)
CLAUDE_MODEL = 'anthropic.claude-3-haiku-20240307-v1:0'  # Haiku: 92% 저렴

# 시스템 프롬프트
SYSTEM_PROMPT = """You are Emma, a friendly AI English tutor making a phone call to help the student practice English conversation.

Guidelines:
- Accent: {accent}
- Difficulty Level: {level}
- Topic: {topic}
- Keep responses natural and conversational (2-3 sentences max)
- Ask follow-up questions to keep the conversation flowing
- Gently correct major grammar errors when appropriate
- Be encouraging and supportive
- Respond in English only

If this is the first message, greet the student warmly and ask them a simple opening question related to the topic."""

# 분석용 프롬프트
ANALYSIS_PROMPT = """Analyze the following English conversation between a student and an AI tutor.
Provide a detailed analysis in JSON format.

Conversation:
{conversation}

Analyze ONLY the student's messages (role: user) and return a JSON object with:

{{
  "cafp_scores": {{
    "complexity": <0-100, vocabulary diversity and sentence structure complexity>,
    "accuracy": <0-100, grammatical correctness>,
    "fluency": <0-100, natural flow and coherence>,
    "pronunciation": <0-100, estimate based on word choice indicating possible pronunciation difficulties>
  }},
  "fillers": {{
    "count": <number of filler words used>,
    "words": [<list of filler words found: um, uh, like, you know, basically, actually, literally, I mean, so, well, etc.>],
    "percentage": <percentage of words that are fillers>
  }},
  "grammar_corrections": [
    {{
      "original": "<original sentence with error>",
      "corrected": "<corrected sentence>",
      "explanation": "<brief explanation in Korean>"
    }}
  ],
  "vocabulary": {{
    "total_words": <total words spoken by student>,
    "unique_words": <unique words count>,
    "advanced_words": [<list of advanced vocabulary used>],
    "suggested_words": [<3-5 advanced words they could have used>]
  }},
  "overall_feedback": "<2-3 sentences of encouraging feedback in Korean>",
  "improvement_tips": [<3 specific tips for improvement in Korean>]
}}

Return ONLY valid JSON, no other text."""


def lambda_handler(event, context):
    """
    Main Lambda handler for AI English conversation
    """
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    try:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action', 'chat')

        if action == 'chat':
            return handle_chat(body, headers)
        elif action == 'tts':
            return handle_tts(body, headers)
        elif action == 'stt':
            return handle_stt(body, headers)
        elif action == 'analyze':
            return handle_analyze(body, headers)
        else:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Invalid action'})
            }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }


def handle_chat(body, headers):
    """
    Handle chat conversation with Bedrock Claude Haiku (저비용)
    """
    messages = body.get('messages', [])
    settings = body.get('settings', {})

    accent_map = {
        'us': 'American English',
        'uk': 'British English',
        'au': 'Australian English',
        'in': 'Indian English'
    }
    level_map = {
        'beginner': 'Beginner (use simple words and short sentences)',
        'intermediate': 'Intermediate (normal conversation level)',
        'advanced': 'Advanced (use complex vocabulary and idioms)'
    }
    topic_map = {
        'business': 'Business and workplace situations',
        'daily': 'Daily life and casual conversation',
        'travel': 'Travel and tourism',
        'interview': 'Job interviews and professional settings'
    }

    system = SYSTEM_PROMPT.format(
        accent=accent_map.get(settings.get('accent', 'us'), 'American English'),
        level=level_map.get(settings.get('level', 'intermediate'), 'Intermediate'),
        topic=topic_map.get(settings.get('topic', 'business'), 'Business')
    )

    claude_messages = []
    for msg in messages:
        claude_messages.append({
            'role': msg.get('role', 'user'),
            'content': msg.get('content', '')
        })

    if not claude_messages:
        claude_messages = [{'role': 'user', 'content': 'Hello, let\'s start our English practice session.'}]

    # Haiku 모델 사용 (저비용)
    response = bedrock.invoke_model(
        modelId=CLAUDE_MODEL,
        contentType='application/json',
        accept='application/json',
        body=json.dumps({
            'anthropic_version': 'bedrock-2023-05-31',
            'max_tokens': 300,
            'system': system,
            'messages': claude_messages
        })
    )

    result = json.loads(response['body'].read())
    assistant_message = result['content'][0]['text']

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            'message': assistant_message,
            'role': 'assistant'
        })
    }


def handle_stt(body, headers):
    """
    Handle Speech-to-Text with AWS Transcribe
    음성 데이터를 텍스트로 변환
    """
    audio_base64 = body.get('audio', '')
    language = body.get('language', 'en-US')

    if not audio_base64:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'No audio data provided'})
        }

    try:
        # Base64 디코딩
        audio_data = base64.b64decode(audio_base64)

        # S3에 임시 저장
        import time
        job_name = f"stt-{int(time.time() * 1000)}"
        s3_key = f"audio/{job_name}.webm"

        s3.put_object(
            Bucket=S3_BUCKET,
            Key=s3_key,
            Body=audio_data,
            ContentType='audio/webm'
        )

        # Transcribe 작업 시작
        transcribe.start_transcription_job(
            TranscriptionJobName=job_name,
            Media={'MediaFileUri': f's3://{S3_BUCKET}/{s3_key}'},
            MediaFormat='webm',
            LanguageCode=language,
            Settings={
                'ShowSpeakerLabels': False,
                'ChannelIdentification': False
            }
        )

        # 작업 완료 대기 (최대 30초)
        import time
        max_tries = 30
        for _ in range(max_tries):
            status = transcribe.get_transcription_job(TranscriptionJobName=job_name)
            job_status = status['TranscriptionJob']['TranscriptionJobStatus']

            if job_status == 'COMPLETED':
                # 결과 가져오기
                transcript_uri = status['TranscriptionJob']['Transcript']['TranscriptFileUri']
                import urllib.request
                with urllib.request.urlopen(transcript_uri) as response:
                    transcript_data = json.loads(response.read().decode())

                transcript_text = transcript_data['results']['transcripts'][0]['transcript']

                # 정리
                s3.delete_object(Bucket=S3_BUCKET, Key=s3_key)
                transcribe.delete_transcription_job(TranscriptionJobName=job_name)

                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({
                        'transcript': transcript_text,
                        'success': True
                    })
                }
            elif job_status == 'FAILED':
                raise Exception('Transcription failed')

            time.sleep(1)

        raise Exception('Transcription timeout')

    except Exception as e:
        print(f"STT error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e), 'success': False})
        }


def handle_tts(body, headers):
    """
    Handle Text-to-Speech with Amazon Polly (Standard 엔진 - 저비용)
    """
    text = body.get('text', '')
    settings = body.get('settings', {})
    accent = settings.get('accent', 'us')
    gender = settings.get('gender', 'female')

    # Standard 엔진용 음성 매핑 (저비용)
    # Standard 지원 음성만 사용
    voice_map = {
        ('us', 'female'): ('Joanna', 'neural'),      # Joanna는 neural만 지원
        ('us', 'male'): ('Matthew', 'neural'),        # Matthew는 neural만 지원
        ('uk', 'female'): ('Amy', 'neural'),
        ('uk', 'male'): ('Brian', 'neural'),
        ('au', 'female'): ('Nicole', 'standard'),     # Nicole은 standard만 지원
        ('au', 'male'): ('Russell', 'standard'),      # Russell은 standard만 지원
        ('in', 'female'): ('Aditi', 'standard'),      # Aditi는 standard만 지원
        ('in', 'male'): ('Aditi', 'standard'),
    }

    voice_id, engine = voice_map.get((accent, gender), ('Joanna', 'neural'))

    try:
        response = polly.synthesize_speech(
            Text=text,
            OutputFormat='mp3',
            VoiceId=voice_id,
            Engine=engine
        )

        audio_data = response['AudioStream'].read()
        audio_base64 = base64.b64encode(audio_data).decode('utf-8')

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'audio': audio_base64,
                'contentType': 'audio/mpeg',
                'voice': voice_id,
                'engine': engine
            })
        }
    except Exception as e:
        print(f"TTS error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }


def handle_analyze(body, headers):
    """
    Analyze conversation with AI - fillers, grammar, CAFP scores
    Haiku 모델 사용 (저비용)
    """
    messages = body.get('messages', [])

    if not messages:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'No messages to analyze'})
        }

    conversation_text = ""
    for msg in messages:
        role = msg.get('role', msg.get('speaker', 'user'))
        content = msg.get('content', msg.get('en', ''))
        if role in ['user', 'assistant']:
            conversation_text += f"{role}: {content}\n"

    user_messages = [m.get('content', m.get('en', '')) for m in messages
                     if m.get('role', m.get('speaker')) == 'user']
    user_text = ' '.join(user_messages).lower()

    filler_words = ['um', 'uh', 'like', 'you know', 'basically', 'actually',
                    'literally', 'i mean', 'so', 'well', 'kind of', 'sort of']
    found_fillers = []
    for filler in filler_words:
        count = len(re.findall(r'\b' + filler + r'\b', user_text))
        if count > 0:
            found_fillers.extend([filler] * count)

    try:
        prompt = ANALYSIS_PROMPT.format(conversation=conversation_text)

        # Haiku 모델 사용 (저비용)
        response = bedrock.invoke_model(
            modelId=CLAUDE_MODEL,
            contentType='application/json',
            accept='application/json',
            body=json.dumps({
                'anthropic_version': 'bedrock-2023-05-31',
                'max_tokens': 1500,
                'messages': [{'role': 'user', 'content': prompt}]
            })
        )

        result = json.loads(response['body'].read())
        analysis_text = result['content'][0]['text']

        json_match = re.search(r'\{[\s\S]*\}', analysis_text)
        if json_match:
            analysis = json.loads(json_match.group())
        else:
            raise ValueError("No JSON found in response")

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'analysis': analysis,
                'success': True
            })
        }

    except Exception as e:
        print(f"Analysis error: {str(e)}")
        word_count = len(user_text.split())
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'analysis': {
                    'cafp_scores': {
                        'complexity': 70,
                        'accuracy': 75,
                        'fluency': 72,
                        'pronunciation': 78
                    },
                    'fillers': {
                        'count': len(found_fillers),
                        'words': found_fillers,
                        'percentage': round(len(found_fillers) / max(word_count, 1) * 100, 1)
                    },
                    'grammar_corrections': [],
                    'vocabulary': {
                        'total_words': word_count,
                        'unique_words': len(set(user_text.split())),
                        'advanced_words': [],
                        'suggested_words': []
                    },
                    'overall_feedback': '대화를 잘 하셨습니다! 계속 연습하시면 더 좋아질 거예요.',
                    'improvement_tips': [
                        '더 다양한 어휘를 사용해보세요',
                        '문장을 조금 더 길게 만들어보세요',
                        '필러 단어 사용을 줄여보세요'
                    ]
                },
                'success': True,
                'fallback': True
            })
        }
