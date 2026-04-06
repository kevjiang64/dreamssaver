import type { Mood } from "@/lib/constants";

export type DreamRow = {
  id: string;
  user_id: string;
  title: string | null;
  description: string;
  dream_date: string;
  mood_upon_waking: Mood;
  is_lucid: boolean;
  created_at: string;
  updated_at: string;
};

export type DreamInsightRow = {
  id: string;
  dream_id: string;
  insight_text: string;
  generated_at: string;
  ai_model_version: string;
};

export type TagRow = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

export type UserProfileRow = {
  id: string;
  email: string;
  subscription_status: "free" | "subscribed" | "cancelled" | "past_due";
  stripe_customer_id: string | null;
  ai_insights_used_count: number;
  ai_insight_limit: number;
};

export type DreamWithTags = DreamRow & { tags: string[] };
