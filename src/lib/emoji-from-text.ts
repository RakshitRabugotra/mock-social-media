/**
 * Emoji sentiment mapper
 * Input: string
 * Output: emoji
 */

type EmotionKey =
  | "happy"
  | "excited"
  | "sad"
  | "angry"
  | "neutral"
  | "love"
  | "gratitude"
  | "relaxed"
  | "proud"
  | "confident"
  | "hopeful"
  | "inspired"
  | "nostalgic"
  | "lonely"
  | "anxious"
  | "stressed"
  | "frustrated"
  | "confused"
  | "surprised"
  | "shocked"
  | "disappointed"
  | "embarrassed"
  | "guilty"
  | "bored"
  | "sarcastic"
  | "playful"
  | "celebratory";

interface EmotionConfig {
  emoji: string;
  weight: number;
  words: string[];
}

/* ---------------- EMOTION MAP ---------------- */

const EMOTION_KEYWORDS: Record<EmotionKey, EmotionConfig> = {
  happy: {
    emoji: "😊",
    weight: 1,
    words: [
      "happy", "joy", "cheerful", "smile", "content", "delighted",
      "fantastic", "great", "amazing", "wonderful",
    ],
  },

  excited: {
    emoji: "🤩",
    weight: 1.6,
    words: [
      "excited", "thrilled", "can't wait", "pumped",
      "ecstatic", "hyped", "buzzing",
    ],
  },

  love: {
    emoji: "❤️",
    weight: 1.8,
    words: [
      "love", "adore", "cherish", "deeply care",
      "my heart", "in love",
    ],
  },

  gratitude: {
    emoji: "🙏",
    weight: 1.4,
    words: [
      "grateful", "thankful", "blessed", "appreciate",
      "thank you", "so thankful",
    ],
  },

  relaxed: {
    emoji: "😌",
    weight: 1.3,
    words: [
      "relaxed", "calm", "peaceful", "chill",
      "unwinding", "at ease", "slow down",
    ],
  },

  proud: {
    emoji: "😤",
    weight: 1.4,
    words: [
      "proud", "accomplished", "achieved", "earned",
      "hard work paid off",
    ],
  },

  confident: {
    emoji: "😎",
    weight: 1.4,
    words: [
      "confident", "strong", "fearless",
      "ready", "unstoppable",
    ],
  },

  hopeful: {
    emoji: "🌈",
    weight: 1.3,
    words: [
      "hope", "hopeful", "looking forward",
      "better days", "optimistic",
    ],
  },

  inspired: {
    emoji: "✨",
    weight: 1.4,
    words: [
      "inspired", "motivated", "energized",
      "driven", "creative spark",
    ],
  },

  nostalgic: {
    emoji: "🥲",
    weight: 1.3,
    words: [
      "nostalgic", "memories", "throwback",
      "old days", "miss those days",
    ],
  },

  sad: {
    emoji: "😢",
    weight: 1,
    words: [
      "sad", "down", "heartbroken",
      "unhappy", "blue",
    ],
  },

  lonely: {
    emoji: "😔",
    weight: 1.2,
    words: [
      "lonely", "alone", "isolated",
      "nobody", "by myself",
    ],
  },

  anxious: {
    emoji: "😰",
    weight: 1.4,
    words: [
      "anxious", "nervous", "worried",
      "panic", "uneasy",
    ],
  },

  stressed: {
    emoji: "😩",
    weight: 1.4,
    words: [
      "stressed", "overwhelmed", "burnt out",
      "too much", "pressure",
    ],
  },

  frustrated: {
    emoji: "😤",
    weight: 1.3,
    words: [
      "frustrated", "fed up", "irritated",
      "annoying", "this sucks",
    ],
  },

  angry: {
    emoji: "😠",
    weight: 1.4,
    words: [
      "angry", "mad", "furious",
      "rage", "pissed",
    ],
  },

  confused: {
    emoji: "😕",
    weight: 1.2,
    words: [
      "confused", "lost", "unsure",
      "don't understand", "what is happening",
    ],
  },

  surprised: {
    emoji: "😮",
    weight: 1.3,
    words: [
      "surprised", "unexpected",
      "didn't expect", "wow",
    ],
  },

  shocked: {
    emoji: "😱",
    weight: 1.6,
    words: [
      "shocked", "can't believe",
      "stunned", "speechless",
    ],
  },

  disappointed: {
    emoji: "😞",
    weight: 1.3,
    words: [
      "disappointed", "let down",
      "expected more", "bummed",
    ],
  },

  embarrassed: {
    emoji: "😳",
    weight: 1.2,
    words: [
      "embarrassed", "awkward",
      "cringe", "so awkward",
    ],
  },

  guilty: {
    emoji: "😬",
    weight: 1.2,
    words: [
      "guilty", "my fault",
      "regret", "shouldn't have",
    ],
  },

  bored: {
    emoji: "😐",
    weight: 1,
    words: [
      "bored", "nothing to do",
      "meh", "dull",
    ],
  },

  sarcastic: {
    emoji: "🙃",
    weight: 1.1,
    words: [
      "yeah right", "sure", "as if",
      "totally", "obviously",
    ],
  },

  playful: {
    emoji: "😜",
    weight: 1.2,
    words: [
      "just kidding", "lol", "haha",
      "teasing", "playful",
    ],
  },

  celebratory: {
    emoji: "🎉",
    weight: 1.7,
    words: [
      "celebrating", "party", "cheers",
      "milestone", "we did it",
    ],
  },

  neutral: {
    emoji: "💭",
    weight: 0,
    words: [],
  },
};


/* ---------------- CORE FUNCTION ---------------- */

export function getEmojiFromText(text: string = ""): string {
  if (!text.trim()) {
    return EMOTION_KEYWORDS.neutral.emoji;
  }

  const lower = text.toLowerCase();
  let maxScore = 0;
  let selectedEmoji = EMOTION_KEYWORDS.neutral.emoji;

  (Object.keys(EMOTION_KEYWORDS) as EmotionKey[]).forEach((emotion) => {
    const { words, emoji, weight } = EMOTION_KEYWORDS[emotion];
    let score = 0;

    for (const word of words) {
      if (lower.includes(word)) {
        score += weight;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      selectedEmoji = emoji;
    }
  });

  return selectedEmoji;
}

/* ---------------- OPTIONAL: DEBOUNCE ---------------- */

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* ---------------- QUICK TEST ---------------- */

// const text = `Had a fantastic lunch with friends today at our favorite Italian restaurant...`;
// console.log(getEmojiFromText(text)); // 😊
