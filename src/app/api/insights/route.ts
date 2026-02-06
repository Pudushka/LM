import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const insights = [
    {
      id: 1,
      type: "opportunity",
      title: "Rising query: 'AI content optimization'",
      description:
        "This query has seen a 340% increase in AI search volume. Your brand is not yet being mentioned.",
      impact: "high",
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      type: "warning",
      title: "Competitor gaining visibility on Perplexity",
      description:
        "Competitor A has overtaken your position for 'AI search tools' queries on Perplexity.",
      impact: "medium",
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      type: "success",
      title: "Strong presence on ChatGPT for brand queries",
      description:
        "Your brand is mentioned in 92% of relevant ChatGPT queries with positive sentiment.",
      impact: "positive",
      created_at: new Date().toISOString(),
    },
  ];

  return NextResponse.json({ insights });
}
