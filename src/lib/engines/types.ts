export interface EngineQuery {
  prompt: string;
  businessName: string;
  businessWebsite: string;
  location: string;
  specialty: string;
}

export interface EngineResponse {
  engine: string;
  response: string;
  mentioned: boolean;
  mentionContext: string | null;
  competitors: string[];
  sentiment: "positive" | "neutral" | "negative" | null;
}

export interface AnalysisResult {
  analysis: string;
  recommendations: string[];
}

export interface EngineAdapter {
  name: string;
  query(input: EngineQuery): Promise<EngineResponse>;
}
