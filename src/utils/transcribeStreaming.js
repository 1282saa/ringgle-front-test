/**
 * @file utils/transcribeStreaming.js
 * @description AWS Transcribe Streaming WebSocket client using AWS SDK
 *
 * Real-time speech recognition via WebSocket
 * - Uses AWS SDK eventstream-codec for proper binary encoding
 * - Presigned URL authentication
 * - Partial and final transcript handling
 */

import { EventStreamCodec } from '@aws-sdk/eventstream-codec'
import { toUtf8, fromUtf8 } from '@aws-sdk/util-utf8'
import { getTranscribeStreamingUrl } from './api'

// Create codec instance for encoding/decoding event stream messages
const eventStreamCodec = new EventStreamCodec(toUtf8, fromUtf8)

/**
 * AWS Transcribe Streaming Client Class
 */
export class TranscribeStreamingClient {
  constructor(options = {}) {
    this.language = options.language || 'en-US'
    this.sampleRate = options.sampleRate || 16000
    this.onTranscript = options.onTranscript || (() => {})
    this.onPartialTranscript = options.onPartialTranscript || (() => {})
    this.onError = options.onError || console.error
    this.onClose = options.onClose || (() => {})
    this.onOpen = options.onOpen || (() => {})

    this.websocket = null
    this.isConnected = false
    this.audioContext = null
    this.mediaStreamSource = null
    this.processor = null
    this.stream = null
    this.audioWorklet = null
  }

  /**
   * Start WebSocket connection and audio streaming
   * @param {MediaStream} mediaStream - Microphone MediaStream
   */
  async start(mediaStream) {
    try {
      console.log('[TranscribeStreaming] Starting...')

      // 1. Get presigned URL
      const { url } = await getTranscribeStreamingUrl(this.language, this.sampleRate)
      console.log('[TranscribeStreaming] Got presigned URL')

      // 2. Connect WebSocket
      this.websocket = new WebSocket(url)
      this.stream = mediaStream

      this.websocket.binaryType = 'arraybuffer'

      this.websocket.onopen = () => {
        console.log('[TranscribeStreaming] WebSocket connected')
        this.isConnected = true
        this.onOpen()

        // Start audio streaming
        this._startAudioStreaming(mediaStream)
      }

      this.websocket.onmessage = (event) => {
        this._handleMessage(event.data)
      }

      this.websocket.onerror = (error) => {
        console.error('[TranscribeStreaming] WebSocket error:', error)
        this.onError(error)
      }

      this.websocket.onclose = (event) => {
        console.log('[TranscribeStreaming] WebSocket closed:', event.code, event.reason)
        this.isConnected = false
        this.onClose(event)
      }

    } catch (error) {
      console.error('[TranscribeStreaming] Start error:', error)
      this.onError(error)
      throw error
    }
  }

  /**
   * Stop streaming
   */
  stop() {
    console.log('[TranscribeStreaming] Stopping...')

    // Stop audio processing
    if (this.processor) {
      this.processor.disconnect()
      this.processor = null
    }

    if (this.mediaStreamSource) {
      this.mediaStreamSource.disconnect()
      this.mediaStreamSource = null
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close()
      this.audioContext = null
    }

    // Close WebSocket
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      // Send end of stream signal
      this._sendEndOfStream()
      setTimeout(() => {
        if (this.websocket) {
          this.websocket.close()
          this.websocket = null
        }
      }, 500)
    }

    this.isConnected = false
  }

  /**
   * Start audio streaming (internal)
   * @private
   */
  _startAudioStreaming(mediaStream) {
    try {
      // Create AudioContext (16kHz sample rate)
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: this.sampleRate,
      })

      this.mediaStreamSource = this.audioContext.createMediaStreamSource(mediaStream)

      // ScriptProcessor for raw audio data
      // Buffer size: 4096 samples (~256ms at 16kHz)
      const bufferSize = 4096
      this.processor = this.audioContext.createScriptProcessor(bufferSize, 1, 1)

      this.processor.onaudioprocess = (event) => {
        if (!this.isConnected || !this.websocket) return

        const inputData = event.inputBuffer.getChannelData(0)

        // Float32 -> Int16 PCM conversion
        const pcmData = this._floatTo16BitPCM(inputData)

        // Send as AWS event stream message
        this._sendAudioEvent(pcmData)
      }

      this.mediaStreamSource.connect(this.processor)
      this.processor.connect(this.audioContext.destination)

      console.log('[TranscribeStreaming] Audio streaming started')

    } catch (error) {
      console.error('[TranscribeStreaming] Audio setup error:', error)
      this.onError(error)
    }
  }

  /**
   * Convert Float32 array to 16-bit PCM
   * @private
   */
  _floatTo16BitPCM(float32Array) {
    const buffer = new ArrayBuffer(float32Array.length * 2)
    const view = new DataView(buffer)

    for (let i = 0; i < float32Array.length; i++) {
      // Clamp to -1.0 ~ 1.0
      const s = Math.max(-1, Math.min(1, float32Array[i]))
      // Convert to 16-bit integer (little endian)
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    }

    return new Uint8Array(buffer)
  }

  /**
   * Create and send AWS event stream audio message
   * @private
   */
  _sendAudioEvent(pcmData) {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) return

    try {
      // Create event stream message using AWS SDK codec
      const message = {
        headers: {
          ':content-type': {
            type: 'string',
            value: 'application/octet-stream',
          },
          ':event-type': {
            type: 'string',
            value: 'AudioEvent',
          },
          ':message-type': {
            type: 'string',
            value: 'event',
          },
        },
        body: pcmData,
      }

      // Encode message using AWS SDK eventstream codec
      const encoded = eventStreamCodec.encode(message)

      this.websocket.send(encoded)
    } catch (error) {
      console.error('[TranscribeStreaming] Send audio error:', error)
    }
  }

  /**
   * Send end of stream signal
   * @private
   */
  _sendEndOfStream() {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) return

    try {
      // Empty audio event signals end of stream
      const message = {
        headers: {
          ':content-type': {
            type: 'string',
            value: 'application/octet-stream',
          },
          ':event-type': {
            type: 'string',
            value: 'AudioEvent',
          },
          ':message-type': {
            type: 'string',
            value: 'event',
          },
        },
        body: new Uint8Array(0),
      }

      const encoded = eventStreamCodec.encode(message)
      this.websocket.send(encoded)
      console.log('[TranscribeStreaming] End of stream sent')
    } catch (error) {
      console.error('[TranscribeStreaming] Send end of stream error:', error)
    }
  }

  /**
   * Handle incoming message
   * @private
   */
  _handleMessage(data) {
    try {
      // Decode event stream message using AWS SDK codec
      const decoded = eventStreamCodec.decode(new Uint8Array(data))

      const headers = {}
      for (const [key, value] of Object.entries(decoded.headers)) {
        headers[key] = value.value
      }

      const messageType = headers[':message-type']

      if (messageType === 'exception') {
        const exceptionType = headers[':exception-type']
        const errorMessage = new TextDecoder().decode(decoded.body)
        console.error('[TranscribeStreaming] Exception:', exceptionType, errorMessage)

        // Parse error JSON if possible
        try {
          const errorJson = JSON.parse(errorMessage)
          this.onError(new Error(errorJson.Message || errorMessage))
        } catch {
          this.onError(new Error(errorMessage))
        }
        return
      }

      // Handle transcript events
      const eventType = headers[':event-type']
      if (eventType === 'TranscriptEvent') {
        const transcriptJson = new TextDecoder().decode(decoded.body)
        const transcript = JSON.parse(transcriptJson)
        this._processTranscript(transcript)
      }

    } catch (error) {
      console.error('[TranscribeStreaming] Message parse error:', error)
    }
  }

  /**
   * Process transcript results
   * @private
   */
  _processTranscript(transcript) {
    const results = transcript.Transcript?.Results

    if (!results || results.length === 0) return

    for (const result of results) {
      const alternatives = result.Alternatives

      if (!alternatives || alternatives.length === 0) continue

      const text = alternatives[0].Transcript

      if (result.IsPartial) {
        // Partial result (for real-time display)
        console.log('[TranscribeStreaming] Partial:', text)
        this.onPartialTranscript(text)
      } else {
        // Final result
        console.log('[TranscribeStreaming] Final:', text)
        this.onTranscript(text)
      }
    }
  }
}

/**
 * Convenience function to start streaming STT
 *
 * @param {Object} options - Options
 * @param {string} options.language - Language code
 * @param {Function} options.onPartialTranscript - Partial result callback
 * @param {Function} options.onTranscript - Final result callback
 * @param {Function} options.onError - Error callback
 * @returns {Promise<{client: TranscribeStreamingClient, stream: MediaStream}>}
 *
 * @example
 * const { client, stream } = await startStreamingSTT({
 *   onPartialTranscript: (text) => setPartialText(text),
 *   onTranscript: (text) => setFinalText(text),
 *   onError: (err) => console.error(err)
 * })
 *
 * // Stop later
 * client.stop()
 * stream.getTracks().forEach(t => t.stop())
 */
export async function startStreamingSTT(options = {}) {
  // Request microphone access
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1,
      sampleRate: 16000,
      echoCancellation: true,
      noiseSuppression: true,
    },
  })

  const client = new TranscribeStreamingClient({
    language: options.language || 'en-US',
    sampleRate: 16000,
    onTranscript: options.onTranscript,
    onPartialTranscript: options.onPartialTranscript,
    onError: options.onError,
    onClose: options.onClose,
    onOpen: options.onOpen,
  })

  await client.start(stream)

  return { client, stream }
}
