export const FREE_AI_INSIGHT_LIMIT = 5;

export const PREMIUM_PRICE_LABEL = "$8/month";

export const MOODS = [
  "Happy",
  "Anxious",
  "Calm",
  "Neutral",
  "Excited",
] as const;

export type Mood = (typeof MOODS)[number];
