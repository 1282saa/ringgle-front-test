const API_URL = 'https://n4o7d3c14c.execute-api.us-east-1.amazonaws.com/prod/chat'

export async function sendMessage(messages, settings) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'chat',
        messages,
        settings
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export async function analyzeConversation(messages) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'analyze',
        messages
      })
    })

    if (!response.ok) {
      throw new Error(`Analyze error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Analyze Error:', error)
    throw error
  }
}

export async function textToSpeech(text, settings) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'tts',
        text,
        settings
      })
    })

    if (!response.ok) {
      throw new Error(`TTS error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('TTS Error:', error)
    throw error
  }
}

// AWS Polly 오디오 재생 헬퍼
export function playAudioBase64(base64Audio, audioRef = null) {
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`)

      // audioRef가 제공되면 참조 저장 (정지 가능하도록)
      if (audioRef) {
        audioRef.current = audio
      }

      audio.onended = () => {
        if (audioRef) audioRef.current = null
        resolve()
      }
      audio.onerror = (err) => {
        if (audioRef) audioRef.current = null
        reject(err)
      }
      audio.play()
    } catch (error) {
      reject(error)
    }
  })
}

// AWS Transcribe STT
export async function speechToText(audioBlob, language = 'en-US') {
  try {
    // Blob을 Base64로 변환
    const base64Audio = await blobToBase64(audioBlob)

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'stt',
        audio: base64Audio,
        language
      })
    })

    if (!response.ok) {
      throw new Error(`STT error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('STT Error:', error)
    throw error
  }
}

// Blob을 Base64로 변환
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
