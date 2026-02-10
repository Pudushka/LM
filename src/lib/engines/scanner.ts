import { prisma } from "@/lib/db";
import { OpenAIEngine } from "./openai-engine";
import { AnthropicEngine } from "./anthropic-engine";
import { GeminiEngine } from "./gemini-engine";
import { ResultAnalyzer } from "./analyzer";
import type { EngineAdapter, EngineQuery, EngineResponse } from "./types";

/**
 * Orchestrates the scanning process:
 * 1. Takes a business and its active prompts
 * 2. Queries each AI engine with each prompt
 * 3. Runs diagnostic analysis on the results
 * 4. Stores everything in the database
 */
export async function runScan(scanId: string): Promise<void> {
  const scan = await prisma.scan.findUnique({
    where: { id: scanId },
    include: {
      business: {
        include: {
          prompts: { where: { isActive: true } },
        },
      },
    },
  });

  if (!scan) throw new Error("Scan not found");

  await prisma.scan.update({
    where: { id: scanId },
    data: { status: "running" },
  });

  const business = scan.business;
  const prompts = business.prompts;

  // Initialize available engines (skip if no API key)
  const engines: EngineAdapter[] = [];
  if (process.env.OPENAI_API_KEY) engines.push(new OpenAIEngine());
  if (process.env.ANTHROPIC_API_KEY) engines.push(new AnthropicEngine());
  if (process.env.GOOGLE_GEMINI_API_KEY) engines.push(new GeminiEngine());

  if (engines.length === 0) {
    // Demo mode: generate simulated results
    await runDemoScan(scanId, business, prompts);
    return;
  }

  const analyzer = process.env.OPENAI_API_KEY ? new ResultAnalyzer() : null;

  let totalMentioned = 0;
  let totalQueries = 0;

  try {
    for (const prompt of prompts) {
      const query: EngineQuery = {
        prompt: prompt.text,
        businessName: business.name,
        businessWebsite: business.website,
        location: business.location,
        specialty: business.specialty,
      };

      // Query all engines for this prompt
      const results: EngineResponse[] = [];
      for (const engine of engines) {
        try {
          const result = await engine.query(query);
          results.push(result);
        } catch (error) {
          console.error(
            `Engine ${engine.name} failed for prompt "${prompt.text}":`,
            error
          );
          // Store a failed result
          results.push({
            engine: engine.name,
            response: "Engine query failed",
            mentioned: false,
            mentionContext: null,
            competitors: [],
            sentiment: null,
          });
        }
      }

      // Run analysis if available
      let analysisResult = null;
      if (analyzer) {
        try {
          analysisResult = await analyzer.analyze(
            prompt.text,
            business.name,
            business.website,
            business.location,
            business.specialty,
            results
          );
        } catch (error) {
          console.error("Analysis failed:", error);
        }
      }

      // Store results
      for (const result of results) {
        totalQueries++;
        if (result.mentioned) totalMentioned++;

        await prisma.scanResult.create({
          data: {
            scanId,
            promptId: prompt.id,
            engine: result.engine,
            response: result.response,
            mentioned: result.mentioned,
            mentionContext: result.mentionContext,
            competitors: JSON.stringify(result.competitors),
            sentiment: result.sentiment,
            analysis: analysisResult?.analysis || null,
            recommendations: analysisResult
              ? JSON.stringify(analysisResult.recommendations)
              : null,
          },
        });
      }
    }

    const totalScore =
      totalQueries > 0
        ? Math.round((totalMentioned / totalQueries) * 100)
        : 0;

    await prisma.scan.update({
      where: { id: scanId },
      data: {
        status: "completed",
        totalScore,
        completedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Scan failed:", error);
    await prisma.scan.update({
      where: { id: scanId },
      data: { status: "failed" },
    });
  }
}

/**
 * Demo mode: generates realistic-looking simulated results
 * when no API keys are configured.
 */
async function runDemoScan(
  scanId: string,
  business: { name: string; website: string; location: string; specialty: string },
  prompts: { id: string; text: string }[]
): Promise<void> {
  const engines = ["chatgpt", "claude", "gemini"];
  let totalMentioned = 0;
  let totalQueries = 0;

  for (const prompt of prompts) {
    for (const engine of engines) {
      totalQueries++;
      // Simulate ~30-60% mention rate with some variation per engine
      const mentionProbability =
        engine === "chatgpt" ? 0.4 : engine === "claude" ? 0.3 : 0.5;
      const mentioned = Math.random() < mentionProbability;
      if (mentioned) totalMentioned++;

      const competitors = [
        `${business.location.split(",")[0]} ${business.specialty} Associates`,
        `Premier ${business.specialty} Group`,
        `Dr. Smith ${business.specialty} Center`,
      ].slice(0, Math.floor(Math.random() * 3) + 1);

      const demoAnalysis = mentioned
        ? `${business.name} appears in ${engine} results for this query. The mention appears to be driven by web presence and review signals. The practice is listed alongside ${competitors.length} other providers.`
        : `${business.name} does not appear in ${engine} results for this query. This is likely due to stronger web presence and review profiles of competing practices in ${business.location}. Competitors mentioned include ${competitors.join(", ")}.`;

      const demoRecommendations = mentioned
        ? [
            "Maintain and grow your online review count",
            "Keep website content updated with specialty keywords",
            "Add structured data markup to your website",
          ]
        : [
            "Strengthen Google Business Profile with complete information",
            "Encourage patients to leave detailed online reviews",
            "Create authoritative content about your specialty areas",
            "Add Schema.org MedicalBusiness structured data to website",
          ];

      await prisma.scanResult.create({
        data: {
          scanId,
          promptId: prompt.id,
          engine,
          response: `[Demo Mode] Simulated ${engine} response for: "${prompt.text}". ${
            mentioned
              ? `${business.name} was mentioned as a recommended provider.`
              : `${business.name} was not mentioned. Other providers were recommended instead.`
          }`,
          mentioned,
          mentionContext: mentioned
            ? `...${business.name} is a well-regarded ${business.specialty} practice in ${business.location}...`
            : null,
          competitors: JSON.stringify(competitors),
          sentiment: mentioned
            ? Math.random() > 0.3
              ? "positive"
              : "neutral"
            : null,
          analysis: demoAnalysis,
          recommendations: JSON.stringify(
            demoRecommendations.slice(0, 3)
          ),
        },
      });
    }
  }

  const totalScore =
    totalQueries > 0
      ? Math.round((totalMentioned / totalQueries) * 100)
      : 0;

  await prisma.scan.update({
    where: { id: scanId },
    data: {
      status: "completed",
      totalScore,
      completedAt: new Date(),
    },
  });
}
