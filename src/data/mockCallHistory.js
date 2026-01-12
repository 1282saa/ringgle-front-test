/**
 * @file data/mockCallHistory.js
 * @description 전화내역 목업 데이터
 *
 * 백엔드 API 응답 구조와 동일하게 설계
 * GET /api/sessions?deviceId={deviceId}&month={month}
 */

export const mockCallHistory = [
  // ========== 2026년 1월 ==========
  {
    id: "session_001",
    deviceId: "device_abc123",
    timestamp: "2026-01-11T19:08:00.000Z",
    endedAt: "2026-01-11T19:15:32.000Z",
    duration: 452,
    tutor: { name: "Gwen", accent: "us", gender: "female" },
    settings: { level: "intermediate", topic: "business", speed: "normal" },
    stats: { turnCount: 6, wordCount: 63, userWordCount: 63, aiWordCount: 89 },
    messages: [
      {
        id: "msg_001", role: "assistant",
        content: "Hey! How is your evening going so far? Do you feel relaxed after your busy day?",
        translation: "안녕하세요! 저녁 시간 어떻게 보내고 계세요? 바쁜 하루 후에 좀 쉬셨나요?",
        timestamp: "2026-01-11T19:08:05.000Z", turn: 0, wordCount: 18
      },
      {
        id: "msg_002", role: "user",
        content: "Yeah, I want to talk about my work today. It was really busy.",
        timestamp: "2026-01-11T19:08:45.000Z", turn: 1, wordCount: 14
      },
      {
        id: "msg_003", role: "assistant",
        content: "That sounds interesting! What kind of work do you do?",
        translation: "흥미롭네요! 어떤 일을 하시나요?",
        timestamp: "2026-01-11T19:09:10.000Z", turn: 1, wordCount: 10
      },
      {
        id: "msg_004", role: "user",
        content: "I work as a product manager at a media company. We make news website.",
        timestamp: "2026-01-11T19:09:45.000Z", turn: 2, wordCount: 15
      },
      {
        id: "msg_005", role: "assistant",
        content: "That's great! Media industry is really exciting these days with AI.",
        translation: "멋지네요! 요즘 AI로 미디어 업계가 정말 흥미로워졌죠.",
        timestamp: "2026-01-11T19:10:00.000Z", turn: 2, wordCount: 13
      },
      {
        id: "msg_006", role: "user",
        content: "Yes, exactly. We use AI for many things now.",
        timestamp: "2026-01-11T19:10:30.000Z", turn: 3, wordCount: 10
      }
    ],
    analysis: null,
    corrections: []
  },

  {
    id: "session_002",
    deviceId: "device_abc123",
    timestamp: "2026-01-11T00:09:00.000Z",
    endedAt: "2026-01-11T00:25:47.000Z",
    duration: 1007,
    tutor: { name: "Gwen", accent: "us", gender: "female" },
    settings: { level: "intermediate", topic: "business", speed: "normal" },
    stats: { turnCount: 12, wordCount: 566, userWordCount: 566, aiWordCount: 234 },
    messages: [
      {
        id: "msg_101", role: "assistant",
        content: "Good evening! I heard you work in the tech industry. What kind of work do you do?",
        translation: "좋은 저녁이에요! 테크 업계에서 일하신다고 들었는데요. 어떤 일을 하시나요?",
        timestamp: "2026-01-11T00:09:05.000Z", turn: 0, wordCount: 17
      },
      {
        id: "msg_102", role: "user",
        content: "Um, I. I work every day. Um. Um. I. I. I do, um, work at, um, product manager, um, and. I. I. I went to cafe, um, because I have to work Um, for, um, making, for, um, improving my website, um, that is Seoul Economic Daily, um, English website, um, that is give, um, user to, um, article, um, Um, you know, um, this, this generation is, um, AI generation, um, that is really powerful. So, um, before people, um, breaking, um, breaking down AI, um, just, A lot of people, a lot of staff is working for transcribing and, you know, evaluating. So, that was really Uh, expensive. Um, so, but, but now, um, AI generation, um, uh, automation is really, um, you know, um, easy, easy and, uh, not expensive. So, um, I, I made, um, website, uh, um, all, all is, um, you know, automate, automation.",
        timestamp: "2026-01-11T00:11:30.000Z", turn: 1, wordCount: 156
      },
      {
        id: "msg_103", role: "assistant",
        content: "That's fascinating! So you're a product manager working on an English news website for Seoul Economic Daily. It sounds like you're leveraging AI to automate content processes. How has that changed your workflow?",
        translation: "정말 흥미롭네요! 서울경제신문의 영문 뉴스 웹사이트에서 프로덕트 매니저로 일하시는군요. AI를 활용해서 콘텐츠 프로세스를 자동화하고 계신 것 같은데요. 그것이 업무 방식을 어떻게 바꿨나요?",
        timestamp: "2026-01-11T00:12:00.000Z", turn: 1, wordCount: 35
      },
      {
        id: "msg_104", role: "user",
        content: "Um, so, you know, um, before, um, we need, um, a lot of staff, um, for, um, translating, um, Korean article to, um, English article. But now, um, AI, um, can do, um, that work, um, very fast, um, and, um, accurate. So, um, I, um, save, um, a lot of, um, money, um, and, um, time. Um, you know, um, efficiency, um, is, um, very important, um, in business.",
        timestamp: "2026-01-11T00:13:30.000Z", turn: 2, wordCount: 72
      },
      {
        id: "msg_105", role: "assistant",
        content: "Absolutely, efficiency is crucial in business. It sounds like AI has really transformed your translation process. What other aspects of your work have you automated?",
        translation: "맞아요, 효율성은 비즈니스에서 정말 중요하죠. AI가 번역 프로세스를 정말 변화시킨 것 같네요. 다른 어떤 업무들을 자동화하셨나요?",
        timestamp: "2026-01-11T00:14:00.000Z", turn: 2, wordCount: 26
      },
      {
        id: "msg_106", role: "user",
        content: "Um, so, um, I also, um, automate, um, the, um, data analysis, um, part. Um, you know, um, we have, um, a lot of, um, data, um, from, um, user, um, behavior. So, um, I, um, use, um, AI, um, to, um, analyze, um, that data, um, and, um, give, um, recommendation, um, to, um, user. Um, it's, um, like, um, personalization, um, you know.",
        timestamp: "2026-01-11T00:15:30.000Z", turn: 3, wordCount: 65
      },
      {
        id: "msg_107", role: "assistant",
        content: "Personalization is a great application of AI! Using user behavior data to provide recommendations can really improve user engagement. Have you seen positive results from this?",
        translation: "개인화는 AI의 훌륭한 활용 사례예요! 사용자 행동 데이터를 활용해서 추천을 제공하면 사용자 참여도를 정말 높일 수 있죠. 이것으로 긍정적인 결과를 보셨나요?",
        timestamp: "2026-01-11T00:16:00.000Z", turn: 3, wordCount: 28
      },
      {
        id: "msg_108", role: "user",
        content: "Yes, um, definitely. Um, so, um, our, um, click rate, um, increased, um, about, um, thirty percent, um, and, um, user, um, time, um, on site, um, also, um, increased. Um, so, um, I think, um, AI, um, is, um, very, um, useful, um, for, um, business. I- I want to talking about work, not hobby.",
        timestamp: "2026-01-11T00:17:30.000Z", turn: 4, wordCount: 58
      },
      {
        id: "msg_109", role: "assistant",
        content: "Those are impressive results! A 30% increase in click rate is significant. Let's continue talking about work then. What challenges do you face in implementing AI solutions?",
        translation: "인상적인 결과네요! 클릭률 30% 증가는 상당해요. 그럼 계속 일에 대해 이야기해 볼까요. AI 솔루션을 구현하면서 어떤 어려움에 직면하시나요?",
        timestamp: "2026-01-11T00:18:00.000Z", turn: 4, wordCount: 29
      },
      {
        id: "msg_110", role: "user",
        content: "Um, so, um, the, um, biggest, um, challenge, um, is, um, data, um, quality. Um, you know, um, AI, um, need, um, good, um, data, um, to, um, work, um, well. So, um, I, um, spend, um, a lot of, um, time, um, cleaning, um, and, um, preparing, um, data. So, data you have, when, how many you have data, duration, because I have to know, a guideline, you have, for data, because I want to talking about, trends.",
        timestamp: "2026-01-11T00:20:00.000Z", turn: 5, wordCount: 82
      },
      {
        id: "msg_111", role: "assistant",
        content: "Data quality is indeed one of the biggest challenges in AI. Garbage in, garbage out, as they say. It's interesting that you mention trends. What trends are you seeing in AI for media companies?",
        translation: "데이터 품질은 정말 AI에서 가장 큰 도전 중 하나예요. '쓰레기가 들어가면 쓰레기가 나온다'라고 하잖아요. 트렌드를 언급하셨는데 흥미롭네요. 미디어 회사들의 AI에서 어떤 트렌드를 보고 계신가요?",
        timestamp: "2026-01-11T00:20:30.000Z", turn: 5, wordCount: 37
      },
      {
        id: "msg_112", role: "user",
        content: "Um, so, um, I think, um, the, um, biggest, um, trend, um, is, um, generative AI, um, like, um, ChatGPT. Um, you know, um, it can, um, write, um, article, um, automatically. Um, so, um, many, um, media, um, company, um, start, um, using, um, it. But, um, I think, um, human, um, editor, um, is, um, still, um, important, um, for, um, fact, um, checking, um, and, um, quality, um, control.",
        timestamp: "2026-01-11T00:22:30.000Z", turn: 6, wordCount: 69
      },
      {
        id: "msg_113", role: "assistant",
        content: "That's a very balanced perspective. Generative AI is indeed transforming content creation, but human oversight remains essential for accuracy and quality. Great conversation!",
        translation: "아주 균형 잡힌 관점이에요. 생성형 AI가 콘텐츠 제작을 변화시키고 있지만, 정확성과 품질을 위해 인간의 감독은 여전히 필수적이죠. 좋은 대화였어요!",
        timestamp: "2026-01-11T00:23:00.000Z", turn: 6, wordCount: 25
      },
      {
        id: "msg_114", role: "user",
        content: "Um, I think, um, let's, um, wrap up, um, for today. Um, thank you, um, for, um, the conversation. Um, it was, um, very, um, helpful, um, for, um, my, um, English, um, practice.",
        timestamp: "2026-01-11T00:24:30.000Z", turn: 7, wordCount: 34
      }
    ],
    analysis: {
      cafpScores: {
        complexity: { score: 5.4, level: 5 },
        accuracy: { score: 5.5, level: 5, isBeta: true },
        fluency: { score: 6.6, level: 6 },
        pronunciation: { score: 4.2, level: 4, isBeta: true }
      },
      summary: "이번 수업에서는 레벨이 전반적으로 비슷했어요. Complexity(복잡성), Accuracy(정확성), Fluency(유창성) 중 하나의 영역에 집중하여 다음 수업을 들어보세요.",
      fillers: {
        count: 47,
        percentage: 8.3,
        instances: [
          { text: "No, no, no, no. Retire, um, no. Today is holiday, um, um, and I, I say, um, tired, um, not, not retired.", highlights: ["um"], audioTimestamp: 19 },
          { text: "Um, I. I work every day. Um. Um. I. I. I do, um, work at, um, product manager...", highlights: ["um", "uh", "you know"], audioTimestamp: 117 },
          { text: "Um, so, um, I also, um, automate, um, the, um, data analysis, um, part.", highlights: ["um"], audioTimestamp: 45 }
        ]
      },
      grammarMistakes: {
        count: 4,
        category: "동사 형태",
        instances: [
          { original: "So, before people, breaking down AI", corrected: "So, before people break down AI", error: "breaking", correction: "break", explanation: "동사 형태의 올바르지 않은 사용입니다.", audioTimestamp: 25 },
          { original: "I- I want to talking about work", corrected: "I want to talk about work", error: "talking", correction: "talk", explanation: "want to 뒤에는 동사원형이 와야 합니다.", audioTimestamp: 8 }
        ]
      },
      repetitiveWords: {
        count: 5,
        words: [
          { word: "work", count: 8 },
          { word: "data", count: 6 },
          { word: "know", count: 4 },
          { word: "automation", count: 3 },
          { word: "want", count: 3 }
        ],
        aiSuggestion: "'work' 대신 'labor', 'task', 'job' 등 다양한 표현을 사용해보세요."
      },
      vocabulary: {
        totalWords: 566,
        uniqueWords: 142,
        advancedWords: ["automation", "efficiency", "personalization", "generative", "transcribing"],
        suggestedWords: ["productivity", "streamline", "leverage", "implement", "optimize"]
      },
      overallFeedback: "비즈니스 영어 주제로 잘 대화하셨습니다. 필러워드 사용을 줄이면 더 자연스러운 대화가 될 것 같습니다.",
      improvementTips: [
        "필러워드(um, uh) 사용을 줄여보세요",
        "동사 형태에 주의하세요",
        "다양한 어휘를 사용해보세요"
      ]
    },
    corrections: [
      { id: "corr_101", messageId: "msg_108", originalText: "I want to talking about work", correctedText: "I want to talk about work", explanation: "want to 뒤에는 동사원형이 와야 합니다.", translation: "저는 일에 대해 이야기하고 싶어요" }
    ]
  },

  {
    id: "session_003",
    deviceId: "device_abc123",
    timestamp: "2026-01-10T23:47:00.000Z",
    endedAt: "2026-01-11T00:05:23.000Z",
    duration: 1103,
    tutor: { name: "James", accent: "uk", gender: "male" },
    settings: { level: "advanced", topic: "technology", speed: "normal" },
    stats: { turnCount: 14, wordCount: 787, userWordCount: 787, aiWordCount: 312 },
    messages: [
      { id: "msg_201", role: "assistant", content: "Good evening! I understand you're interested in discussing technology trends. What aspects would you like to explore?", translation: "좋은 저녁이에요! 기술 트렌드에 대해 논의하고 싶으시다고요. 어떤 측면을 탐구해 보고 싶으신가요?", timestamp: "2026-01-10T23:47:05.000Z", turn: 0, wordCount: 18 },
      { id: "msg_202", role: "user", content: "Yes, I'd like to discuss about the current state of AI in journalism and how it's changing the media landscape.", timestamp: "2026-01-10T23:47:45.000Z", turn: 1, wordCount: 20 }
    ],
    analysis: {
      cafpScores: {
        complexity: { score: 6.2, level: 6 },
        accuracy: { score: 6.8, level: 7, isBeta: true },
        fluency: { score: 7.1, level: 7 },
        pronunciation: { score: 5.5, level: 6, isBeta: true }
      },
      summary: "고급 레벨에서 훌륭한 대화를 나누셨습니다. Fluency 점수가 특히 높았습니다.",
      fillers: { count: 12, percentage: 1.5, instances: [] },
      grammarMistakes: {
        count: 2,
        category: "관사 사용",
        instances: [
          { original: "I'd like to discuss about the current state", corrected: "I'd like to discuss the current state", error: "discuss about", correction: "discuss", explanation: "discuss는 타동사이므로 about을 사용하지 않습니다.", audioTimestamp: 5 }
        ]
      },
      repetitiveWords: { count: 3, words: [{ word: "AI", count: 12 }, { word: "journalism", count: 5 }, { word: "content", count: 4 }], aiSuggestion: null },
      vocabulary: { totalWords: 787, uniqueWords: 234, advancedWords: ["journalism", "landscape", "paradigm", "disruption"], suggestedWords: ["convergence", "democratization", "curation"] },
      overallFeedback: "고급 비즈니스 영어를 잘 구사하셨습니다.",
      improvementTips: ["discuss 뒤에 about을 사용하지 않도록 주의하세요"]
    },
    corrections: []
  },

  {
    id: "session_004",
    deviceId: "device_abc123",
    timestamp: "2026-01-09T14:30:00.000Z",
    endedAt: "2026-01-09T14:45:00.000Z",
    duration: 900,
    tutor: { name: "Emma", accent: "us", gender: "female" },
    settings: { level: "intermediate", topic: "daily", speed: "normal" },
    stats: { turnCount: 10, wordCount: 245, userWordCount: 245, aiWordCount: 180 },
    messages: [
      { id: "msg_301", role: "assistant", content: "Hi there! How was your day? Did anything interesting happen?", translation: "안녕하세요! 오늘 하루 어땠어요? 재미있는 일이 있었나요?", timestamp: "2026-01-09T14:30:05.000Z", turn: 0, wordCount: 11 },
      { id: "msg_302", role: "user", content: "Actually, I had a really productive day at work. I finished a big project that I've been working on for weeks.", timestamp: "2026-01-09T14:30:45.000Z", turn: 1, wordCount: 21 }
    ],
    analysis: {
      cafpScores: {
        complexity: { score: 4.8, level: 5 },
        accuracy: { score: 6.2, level: 6, isBeta: true },
        fluency: { score: 5.5, level: 5 },
        pronunciation: { score: 5.0, level: 5, isBeta: true }
      },
      summary: "일상 대화 주제로 자연스럽게 대화하셨습니다. 문법 정확도가 좋았어요.",
      fillers: { count: 8, percentage: 3.2, instances: [] },
      grammarMistakes: { count: 1, category: "시제", instances: [] },
      repetitiveWords: { count: 2, words: [{ word: "work", count: 5 }, { word: "project", count: 3 }], aiSuggestion: null },
      vocabulary: { totalWords: 245, uniqueWords: 98, advancedWords: ["productive", "project"], suggestedWords: ["accomplish", "achievement"] },
      overallFeedback: "일상 대화에서 자연스러운 표현을 잘 사용하셨습니다.",
      improvementTips: ["더 다양한 형용사를 사용해보세요"]
    },
    corrections: []
  },

  {
    id: "session_005",
    deviceId: "device_abc123",
    timestamp: "2026-01-08T20:15:00.000Z",
    endedAt: "2026-01-08T20:22:00.000Z",
    duration: 420,
    tutor: { name: "Oliver", accent: "uk", gender: "male" },
    settings: { level: "beginner", topic: "travel", speed: "slow" },
    stats: { turnCount: 6, wordCount: 89, userWordCount: 89, aiWordCount: 120 },
    messages: [
      { id: "msg_401", role: "assistant", content: "Hello! Have you traveled anywhere recently?", translation: "안녕하세요! 최근에 여행 가신 곳이 있나요?", timestamp: "2026-01-08T20:15:05.000Z", turn: 0, wordCount: 7 },
      { id: "msg_402", role: "user", content: "Yes, I go to Japan last month. It was very fun.", timestamp: "2026-01-08T20:15:45.000Z", turn: 1, wordCount: 11 }
    ],
    analysis: null,
    corrections: [
      { id: "corr_401", messageId: "msg_402", originalText: "I go to Japan last month", correctedText: "I went to Japan last month", explanation: "과거 시제를 나타낼 때는 'go'가 아닌 'went'를 사용합니다.", translation: "저는 지난달에 일본에 갔어요" }
    ]
  },

  {
    id: "session_006",
    deviceId: "device_abc123",
    timestamp: "2026-01-07T09:00:00.000Z",
    endedAt: "2026-01-07T09:18:00.000Z",
    duration: 1080,
    tutor: { name: "Sophia", accent: "us", gender: "female" },
    settings: { level: "intermediate", topic: "business", speed: "normal" },
    stats: { turnCount: 14, wordCount: 423, userWordCount: 423, aiWordCount: 290 },
    messages: [
      { id: "msg_501", role: "assistant", content: "Good morning! Let's talk about your career goals today. What are you hoping to achieve this year?", translation: "좋은 아침이에요! 오늘은 커리어 목표에 대해 이야기해볼까요. 올해 이루고 싶은 것이 무엇인가요?", timestamp: "2026-01-07T09:00:05.000Z", turn: 0, wordCount: 17 },
      { id: "msg_502", role: "user", content: "Well, I want to improve my English speaking skills and get promoted to a senior position at my company.", timestamp: "2026-01-07T09:00:45.000Z", turn: 1, wordCount: 19 }
    ],
    analysis: {
      cafpScores: {
        complexity: { score: 5.8, level: 6 },
        accuracy: { score: 6.5, level: 6, isBeta: true },
        fluency: { score: 6.0, level: 6 },
        pronunciation: { score: 5.2, level: 5, isBeta: true }
      },
      summary: "커리어 목표에 대해 명확하게 표현하셨습니다. 비즈니스 어휘를 잘 활용하셨어요.",
      fillers: { count: 15, percentage: 3.5, instances: [] },
      grammarMistakes: { count: 2, category: "전치사", instances: [] },
      repetitiveWords: { count: 3, words: [{ word: "company", count: 4 }, { word: "position", count: 3 }, { word: "improve", count: 3 }], aiSuggestion: null },
      vocabulary: { totalWords: 423, uniqueWords: 156, advancedWords: ["promoted", "senior", "achieve"], suggestedWords: ["advancement", "leadership", "milestone"] },
      overallFeedback: "비즈니스 맥락에서 목표를 잘 표현하셨습니다.",
      improvementTips: ["더 구체적인 예시를 들어보세요"]
    },
    corrections: []
  },

  {
    id: "session_007",
    deviceId: "device_abc123",
    timestamp: "2026-01-05T18:30:00.000Z",
    endedAt: "2026-01-05T18:42:00.000Z",
    duration: 720,
    tutor: { name: "Gwen", accent: "us", gender: "female" },
    settings: { level: "intermediate", topic: "hobby", speed: "normal" },
    stats: { turnCount: 8, wordCount: 198, userWordCount: 198, aiWordCount: 145 },
    messages: [
      { id: "msg_601", role: "assistant", content: "Hi! What do you like to do in your free time?", translation: "안녕하세요! 여가 시간에 뭘 하는 걸 좋아하세요?", timestamp: "2026-01-05T18:30:05.000Z", turn: 0, wordCount: 11 },
      { id: "msg_602", role: "user", content: "I enjoy watching movies and reading books. Recently I read a very interesting science fiction novel.", timestamp: "2026-01-05T18:30:45.000Z", turn: 1, wordCount: 17 }
    ],
    analysis: {
      cafpScores: {
        complexity: { score: 4.5, level: 4 },
        accuracy: { score: 5.8, level: 6, isBeta: true },
        fluency: { score: 5.2, level: 5 },
        pronunciation: { score: 4.8, level: 5, isBeta: true }
      },
      summary: "취미에 대해 자연스럽게 대화하셨습니다.",
      fillers: { count: 10, percentage: 5.0, instances: [] },
      grammarMistakes: { count: 1, category: "관사", instances: [] },
      repetitiveWords: { count: 2, words: [{ word: "like", count: 4 }, { word: "book", count: 3 }], aiSuggestion: null },
      vocabulary: { totalWords: 198, uniqueWords: 87, advancedWords: ["science fiction", "novel"], suggestedWords: ["genre", "fascinating", "engrossing"] },
      overallFeedback: "취미에 대해 편안하게 이야기하셨습니다.",
      improvementTips: ["책이나 영화에 대해 더 자세히 설명해보세요"]
    },
    corrections: []
  },

  // ========== 2025년 12월 ==========
  {
    id: "session_008",
    deviceId: "device_abc123",
    timestamp: "2025-12-28T15:00:00.000Z",
    endedAt: "2025-12-28T15:20:00.000Z",
    duration: 1200,
    tutor: { name: "James", accent: "uk", gender: "male" },
    settings: { level: "advanced", topic: "business", speed: "fast" },
    stats: { turnCount: 16, wordCount: 654, userWordCount: 654, aiWordCount: 380 },
    messages: [
      { id: "msg_701", role: "assistant", content: "Good afternoon! Shall we discuss leadership and management styles today?", translation: "좋은 오후에요! 오늘 리더십과 경영 스타일에 대해 이야기해볼까요?", timestamp: "2025-12-28T15:00:05.000Z", turn: 0, wordCount: 11 },
      { id: "msg_702", role: "user", content: "Sure, I've been thinking about how to better lead my team. We've been facing some challenges with communication.", timestamp: "2025-12-28T15:00:45.000Z", turn: 1, wordCount: 20 }
    ],
    analysis: {
      cafpScores: {
        complexity: { score: 6.8, level: 7 },
        accuracy: { score: 7.2, level: 7, isBeta: true },
        fluency: { score: 6.5, level: 6 },
        pronunciation: { score: 5.8, level: 6, isBeta: true }
      },
      summary: "리더십에 대한 심도 있는 대화를 나누셨습니다. 복잡한 개념을 잘 표현하셨어요.",
      fillers: { count: 8, percentage: 1.2, instances: [] },
      grammarMistakes: { count: 1, category: "시제 일치", instances: [] },
      repetitiveWords: { count: 4, words: [{ word: "team", count: 6 }, { word: "communication", count: 5 }, { word: "lead", count: 4 }, { word: "challenge", count: 3 }], aiSuggestion: null },
      vocabulary: { totalWords: 654, uniqueWords: 245, advancedWords: ["leadership", "management", "delegation", "collaboration"], suggestedWords: ["empower", "facilitate", "stakeholder"] },
      overallFeedback: "고급 비즈니스 어휘를 적절히 활용하셨습니다.",
      improvementTips: ["수동태 사용을 줄이고 능동태로 표현해보세요"]
    },
    corrections: []
  },

  {
    id: "session_009",
    deviceId: "device_abc123",
    timestamp: "2025-12-25T10:00:00.000Z",
    endedAt: "2025-12-25T10:12:00.000Z",
    duration: 720,
    tutor: { name: "Emma", accent: "us", gender: "female" },
    settings: { level: "intermediate", topic: "daily", speed: "normal" },
    stats: { turnCount: 8, wordCount: 178, userWordCount: 178, aiWordCount: 140 },
    messages: [
      { id: "msg_801", role: "assistant", content: "Merry Christmas! How are you celebrating the holiday?", translation: "메리 크리스마스! 어떻게 휴일을 보내고 계세요?", timestamp: "2025-12-25T10:00:05.000Z", turn: 0, wordCount: 9 },
      { id: "msg_802", role: "user", content: "Merry Christmas! I'm spending time with my family today. We're going to have a special dinner together.", timestamp: "2025-12-25T10:00:45.000Z", turn: 1, wordCount: 18 }
    ],
    analysis: {
      cafpScores: {
        complexity: { score: 4.2, level: 4 },
        accuracy: { score: 5.5, level: 5, isBeta: true },
        fluency: { score: 5.8, level: 6 },
        pronunciation: { score: 4.5, level: 4, isBeta: true }
      },
      summary: "가족과의 시간에 대해 따뜻하게 대화하셨습니다.",
      fillers: { count: 12, percentage: 6.7, instances: [] },
      grammarMistakes: { count: 0, category: "", instances: [] },
      repetitiveWords: { count: 2, words: [{ word: "family", count: 3 }, { word: "together", count: 2 }], aiSuggestion: null },
      vocabulary: { totalWords: 178, uniqueWords: 72, advancedWords: ["celebrate", "special"], suggestedWords: ["gathering", "tradition", "festive"] },
      overallFeedback: "일상적인 주제를 자연스럽게 표현하셨습니다.",
      improvementTips: ["감정을 표현하는 형용사를 더 사용해보세요"]
    },
    corrections: []
  },

  {
    id: "session_010",
    deviceId: "device_abc123",
    timestamp: "2025-12-20T19:30:00.000Z",
    endedAt: "2025-12-20T19:38:00.000Z",
    duration: 480,
    tutor: { name: "Oliver", accent: "uk", gender: "male" },
    settings: { level: "beginner", topic: "food", speed: "slow" },
    stats: { turnCount: 6, wordCount: 95, userWordCount: 95, aiWordCount: 88 },
    messages: [
      { id: "msg_901", role: "assistant", content: "Hello! What's your favorite food?", translation: "안녕하세요! 가장 좋아하는 음식이 뭐에요?", timestamp: "2025-12-20T19:30:05.000Z", turn: 0, wordCount: 6 },
      { id: "msg_902", role: "user", content: "I like Korean food very much. Especially kimchi jjigae is my favorite.", timestamp: "2025-12-20T19:30:45.000Z", turn: 1, wordCount: 12 }
    ],
    analysis: null,
    corrections: []
  },

  {
    id: "session_011",
    deviceId: "device_abc123",
    timestamp: "2025-12-15T11:00:00.000Z",
    endedAt: "2025-12-15T11:25:00.000Z",
    duration: 1500,
    tutor: { name: "Sophia", accent: "us", gender: "female" },
    settings: { level: "intermediate", topic: "technology", speed: "normal" },
    stats: { turnCount: 18, wordCount: 512, userWordCount: 512, aiWordCount: 340 },
    messages: [
      { id: "msg_1001", role: "assistant", content: "Hi! I heard you're interested in technology. What tech trends are you following these days?", translation: "안녕하세요! 기술에 관심이 있으시다고 들었어요. 요즘 어떤 기술 트렌드를 따라가고 계세요?", timestamp: "2025-12-15T11:00:05.000Z", turn: 0, wordCount: 16 },
      { id: "msg_1002", role: "user", content: "I'm really interested in AI and machine learning. I think they will change everything in the next few years.", timestamp: "2025-12-15T11:00:45.000Z", turn: 1, wordCount: 20 }
    ],
    analysis: {
      cafpScores: {
        complexity: { score: 5.6, level: 5 },
        accuracy: { score: 6.0, level: 6, isBeta: true },
        fluency: { score: 5.8, level: 6 },
        pronunciation: { score: 5.0, level: 5, isBeta: true }
      },
      summary: "기술 트렌드에 대해 관심 있게 대화하셨습니다. 전문 용어를 적절히 사용하셨어요.",
      fillers: { count: 18, percentage: 3.5, instances: [] },
      grammarMistakes: { count: 2, category: "관사", instances: [] },
      repetitiveWords: { count: 4, words: [{ word: "AI", count: 8 }, { word: "technology", count: 5 }, { word: "think", count: 4 }, { word: "change", count: 3 }], aiSuggestion: null },
      vocabulary: { totalWords: 512, uniqueWords: 178, advancedWords: ["machine learning", "artificial intelligence", "algorithm"], suggestedWords: ["innovation", "disruption", "paradigm shift"] },
      overallFeedback: "기술 주제에 대해 열정적으로 대화하셨습니다.",
      improvementTips: ["구체적인 예시를 더 들어보세요"]
    },
    corrections: []
  },

  {
    id: "session_012",
    deviceId: "device_abc123",
    timestamp: "2025-12-10T16:45:00.000Z",
    endedAt: "2025-12-10T16:55:00.000Z",
    duration: 600,
    tutor: { name: "Gwen", accent: "us", gender: "female" },
    settings: { level: "intermediate", topic: "daily", speed: "normal" },
    stats: { turnCount: 8, wordCount: 167, userWordCount: 167, aiWordCount: 120 },
    messages: [
      { id: "msg_1101", role: "assistant", content: "Good afternoon! How's your week going?", translation: "좋은 오후에요! 이번 주 어떻게 지내고 계세요?", timestamp: "2025-12-10T16:45:05.000Z", turn: 0, wordCount: 7 },
      { id: "msg_1102", role: "user", content: "It's been quite busy actually. I have many meetings and deadlines this week.", timestamp: "2025-12-10T16:45:45.000Z", turn: 1, wordCount: 14 }
    ],
    analysis: {
      cafpScores: {
        complexity: { score: 4.5, level: 4 },
        accuracy: { score: 5.5, level: 5, isBeta: true },
        fluency: { score: 5.0, level: 5 },
        pronunciation: { score: 4.8, level: 5, isBeta: true }
      },
      summary: "일상에 대해 간단하지만 명확하게 표현하셨습니다.",
      fillers: { count: 10, percentage: 6.0, instances: [] },
      grammarMistakes: { count: 1, category: "관사", instances: [] },
      repetitiveWords: { count: 2, words: [{ word: "week", count: 3 }, { word: "busy", count: 2 }], aiSuggestion: null },
      vocabulary: { totalWords: 167, uniqueWords: 68, advancedWords: ["deadline", "meeting"], suggestedWords: ["hectic", "overwhelming", "schedule"] },
      overallFeedback: "바쁜 일상을 잘 표현하셨습니다.",
      improvementTips: ["스트레스나 감정에 대해서도 표현해보세요"]
    },
    corrections: []
  }
]

/**
 * 로컬스토리지에 목업 데이터 저장
 * 개발 환경에서 초기 데이터 세팅용
 */
export function loadMockData() {
  const transformed = mockCallHistory.map(session => ({
    id: session.id,
    timestamp: session.timestamp,
    fullDate: new Date(session.timestamp).toLocaleString('ko-KR'),
    date: new Date(session.timestamp).toLocaleDateString('ko-KR'),
    duration: formatDuration(session.duration),
    durationSeconds: session.duration,
    words: session.stats.userWordCount,
    tutorName: session.tutor.name,
    tutor: session.tutor,
    settings: session.settings,
    stats: session.stats,
    messages: session.messages,
    analysis: session.analysis,
    corrections: session.corrections
  }))

  localStorage.setItem('callHistory', JSON.stringify(transformed))
  return transformed
}

/**
 * 초 단위를 MM:SS 형식으로 변환
 */
function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export default mockCallHistory
