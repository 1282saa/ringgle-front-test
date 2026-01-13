# Latency Performance Tracking

Performance metrics for English learning conversation app.

---

## Metrics Definition

| Metric | Description | Start | End |
|--------|-------------|-------|-----|
| **STT** | Speech-to-Text | Silence detected | Transcript received |
| **LLM** | AI Response | API request sent | Response received |
| **TTS** | Text-to-Speech | TTS request sent | Audio playback start |
| **E2E** | End-to-End Turn | User stops speaking | AI audio starts |

---

## Performance Log

### v1.0 — Batch STT (2026-01-12)

| Metric | Latency | Method |
|--------|---------|--------|
| STT | 3,000 - 5,000 ms | AWS Transcribe Batch (S3 upload → polling) |
| LLM | 1,000 - 2,000 ms | Claude 3 Haiku via Bedrock |
| TTS | 500 - 1,000 ms | Amazon Polly Neural |
| **E2E** | **5,000 - 8,000 ms** | - |

### v1.1 — Streaming STT (2026-01-13)

| Metric | Latency | Method |
|--------|---------|--------|
| STT | TBD | AWS Transcribe Streaming (WebSocket) |
| LLM | TBD | Claude 3 Haiku via Bedrock |
| TTS | TBD | Amazon Polly Neural |
| **E2E** | **TBD** | - |

---

## Changelog

| Date | Change | Impact |
|------|--------|--------|
| 2026-01-12 | Added VAD (Voice Activity Detection) | Natural speech endpoint detection |
| 2026-01-13 | Batch STT → Streaming STT | Expected STT: 3-5s → 300-500ms |
| 2026-01-13 | AWS SDK eventstream-codec integration | Proper binary protocol encoding |
| 2026-01-13 | Fixed DynamoDB get_sessions query | Session list now loads correctly |

---

## Development Log (2026-01-13)

### 1. AWS Transcribe Streaming - AWS SDK Integration

**Problem**: Custom event stream encoding was incorrect, causing "Could not decode the audio stream" error.

**Solution**: Replaced custom CRC32C implementation with official AWS SDK packages.

**Files Changed**:
- `package.json` - Added `@aws-sdk/eventstream-codec`, `@aws-sdk/util-utf8`
- `src/utils/transcribeStreaming.js` - Rewritten with AWS SDK codec

**Key Code**:
```javascript
import { EventStreamCodec } from '@aws-sdk/eventstream-codec'
import { toUtf8, fromUtf8 } from '@aws-sdk/util-utf8'

const eventStreamCodec = new EventStreamCodec(toUtf8, fromUtf8)

// Encode audio event
const message = {
  headers: {
    ':content-type': { type: 'string', value: 'application/octet-stream' },
    ':event-type': { type: 'string', value: 'AudioEvent' },
    ':message-type': { type: 'string', value: 'event' },
  },
  body: pcmData,
}
const encoded = eventStreamCodec.encode(message)
websocket.send(encoded)
```

### 2. DynamoDB Session Query Fix

**Problem**: `get_sessions` API returned empty array despite data existing in DB.

**Root Cause**: DynamoDB applies `Limit` before `FilterExpression`. With many MESSAGE records in the table, the query returned only MESSAGE items before SESSION_META items could be found.

**Solution**: Added pagination loop to continue querying until enough SESSION_META items are found.

**File Changed**: `backend/lambda_function.py`

**Before**:
```python
query_params = {
    'Limit': limit * 2,  # Only fetches 20 items
    'FilterExpression': '#type = :type_meta',
    ...
}
response = get_table().query(**query_params)
```

**After**:
```python
for _ in range(max_iterations):
    query_params = {
        'Limit': 100,  # Fetch more items per query
        ...
    }
    response = table.query(**query_params)
    # Collect SESSION_META items
    # Continue until enough found or no more data
```

### 3. Deployment

- Lambda function updated: `eng-learning-api`
- Deployed at: 2026-01-13T01:23:35Z

---

## Target (Ringle-level)

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| STT | 3-5s | < 500ms | 🔄 Testing |
| LLM | 1-2s | < 1s | ⬜ Pending |
| TTS | 0.5-1s | < 300ms | ⬜ Pending |
| **E2E** | **5-8s** | **< 2s** | 🔄 In Progress |

---

## Measurement Method

Console logs in `Call.jsx`:
```
[Streaming] Final transcript: "..."   → STT complete
[Chat] API request sent               → LLM start
[Chat] Response received              → LLM complete
[TTS] Playback started                → TTS complete
```

---

*Last updated: 2026-01-13 10:30 KST*
