import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "30d";

  // In production, fetch from Supabase tables
  // For now, return mock data
  const data = {
    visibility_score: 87.4,
    total_mentions: 1247,
    positive_sentiment: 94.2,
    trend: "rising",
    period,
    engines: [
      { name: "ChatGPT", score: 92, mentions: 456 },
      { name: "Perplexity", score: 87, mentions: 312 },
      { name: "Gemini", score: 79, mentions: 245 },
      { name: "Claude", score: 85, mentions: 189 },
      { name: "Copilot", score: 71, mentions: 45 },
    ],
    daily_scores: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split("T")[0],
      score: 70 + Math.random() * 20,
      mentions: Math.floor(30 + Math.random() * 30),
    })),
  };

  return NextResponse.json(data);
}
