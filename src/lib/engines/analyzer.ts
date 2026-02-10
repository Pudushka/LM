import OpenAI from "openai";
import type { AnalysisResult, EngineResponse } from "./types";

/**
 * Uses an AI model to analyze WHY a business appears or doesn't appear
 * in AI search results, and generates actionable recommendations.
 *
 * This is the "diagnostics + recommendations" layer.
 */
export class ResultAnalyzer {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyze(
    prompt: string,
    businessName: string,
    businessWebsite: string,
    location: string,
    specialty: string,
    results: EngineResponse[]
  ): Promise<AnalysisResult> {
    const resultSummaries = results
      .map((r) => {
        return `**${r.engine.toUpperCase()}**: ${
          r.mentioned
            ? `MENTIONED (sentiment: ${r.sentiment || "neutral"}). Context: "${r.mentionContext || "N/A"}"`
            : `NOT MENTIONED. Competitors found: ${r.competitors.length > 0 ? r.competitors.join(", ") : "None identified"}`
        }`;
      })
      .join("\n");

    const analysisPrompt = `You are an AI visibility analyst. A medical practice wants to understand their presence in AI search results.

BUSINESS: ${businessName}
WEBSITE: ${businessWebsite}
LOCATION: ${location}
SPECIALTY: ${specialty}

SEARCH PROMPT USED: "${prompt}"

RESULTS ACROSS AI ENGINES:
${resultSummaries}

Provide a brief, actionable analysis in this exact JSON format:
{
  "analysis": "A 2-3 sentence diagnostic explaining WHY this business appears or doesn't appear in these AI results. Be specific about likely causes — e.g., web presence strength, structured data, reviews, content authority, or competition intensity.",
  "recommendations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2",
    "Specific actionable recommendation 3"
  ]
}

Rules:
- Be direct and specific, not generic
- Recommendations should be things the practice can actually DO
- Focus on the gap between where they are and where they should be
- If they're mentioned everywhere, focus on improving position/sentiment
- Max 3 recommendations, each under 100 characters
- Return ONLY valid JSON, no other text`;

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: analysisPrompt }],
        max_tokens: 500,
        temperature: 0.3,
        response_format: { type: "json_object" },
      });

      const text = response.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(text);

      return {
        analysis: parsed.analysis || "Analysis not available.",
        recommendations: Array.isArray(parsed.recommendations)
          ? parsed.recommendations
          : [],
      };
    } catch (error) {
      console.error("Analysis error:", error);
      return {
        analysis:
          "Unable to generate analysis at this time. Please try again.",
        recommendations: [],
      };
    }
  }
}
