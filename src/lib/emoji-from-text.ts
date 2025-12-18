/**
 * Emoji sentiment mapper
 * Input: string
 * Output: emoji
 */

type EmotionKey = "happy" | "excited" | "sad" | "angry" | "neutral";

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
      "happy", "grateful", "fantastic", "delicious", "wonderful",
      "refreshed", "enjoy", "love", "great", "amazing", "friends",
      "fun", "laugh", "smile",
    ],
  },
  excited: {
    emoji: "🤩",
    weight: 1.5,
    words: ["excited", "thrilled", "awesome", "can't wait", "best"],
  },
  sad: {
    emoji: "😢",
    weight: 1,
    words: ["sad", "lonely", "tired", "miss", "upset", "cry"],
  },
  angry: {
    emoji: "😠",
    weight: 1,
    words: ["angry", "mad", "furious", "annoyed", "hate"],
  },
  neutral: {
    emoji: "😐",
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
