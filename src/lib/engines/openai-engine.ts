import OpenAI from "openai";
import type { EngineAdapter, EngineQuery, EngineResponse } from "./types";

export class OpenAIEngine implements EngineAdapter {
  name = "chatgpt";
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async query(input: EngineQuery): Promise<EngineResponse> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: input.prompt,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const text = response.choices[0]?.message?.content || "";

    const mentioned = this.checkMention(text, input.businessName);
    const mentionContext = mentioned
      ? this.extractMentionContext(text, input.businessName)
      : null;
    const competitors = this.extractCompetitors(
      text,
      input.businessName
    );
    const sentiment = mentioned ? this.analyzeSentiment(text, input.businessName) : null;

    return {
      engine: this.name,
      response: text,
      mentioned,
      mentionContext,
      competitors,
      sentiment,
    };
  }

  private checkMention(text: string, businessName: string): boolean {
    const lower = text.toLowerCase();
    const nameLower = businessName.toLowerCase();
    // Check for exact name or close variations
    return (
      lower.includes(nameLower) ||
      lower.includes(nameLower.replace(/\s+/g, "")) ||
      lower.includes(nameLower.replace(/\s+(clinic|medical|practice|center|group|health)/i, ""))
    );
  }

  private extractMentionContext(
    text: string,
    businessName: string
  ): string {
    const lower = text.toLowerCase();
    const nameLower = businessName.toLowerCase();
    const idx = lower.indexOf(nameLower);
    if (idx === -1) return "";

    const start = Math.max(0, idx - 100);
    const end = Math.min(text.length, idx + businessName.length + 100);
    return "..." + text.slice(start, end).trim() + "...";
  }

  private extractCompetitors(
    text: string,
    businessName: string
  ): string[] {
    // Simple heuristic: look for other proper nouns that look like business names
    const patterns = [
      /(?:(?:Dr\.?\s+)?[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Clinic|Medical|Practice|Center|Group|Health|Hospital|Associates|Dental|Dermatology|Cardiology|Orthopedics))/g,
    ];
    const names = new Set<string>();
    for (const pattern of patterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const found = match[0].trim();
        if (
          found.toLowerCase() !== businessName.toLowerCase() &&
          found.length > 3
        ) {
          names.add(found);
        }
      }
    }
    return [...names].slice(0, 10);
  }

  private analyzeSentiment(
    text: string,
    businessName: string
  ): "positive" | "neutral" | "negative" {
    const lower = text.toLowerCase();
    const nameLower = businessName.toLowerCase();
    const idx = lower.indexOf(nameLower);
    if (idx === -1) return "neutral";

    const context = lower.slice(
      Math.max(0, idx - 200),
      idx + businessName.length + 200
    );

    const positiveWords = [
      "recommend",
      "excellent",
      "top",
      "best",
      "highly rated",
      "outstanding",
      "reputable",
      "trusted",
      "leading",
      "renowned",
      "well-known",
      "praised",
      "award",
    ];
    const negativeWords = [
      "poor",
      "avoid",
      "complaint",
      "negative",
      "issue",
      "problem",
      "concern",
      "warning",
      "caution",
    ];

    const posCount = positiveWords.filter((w) => context.includes(w)).length;
    const negCount = negativeWords.filter((w) => context.includes(w)).length;

    if (posCount > negCount) return "positive";
    if (negCount > posCount) return "negative";
    return "neutral";
  }
}
