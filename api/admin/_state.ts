export type Provider = "openrouter" | "gemini";

export const OPENROUTER_MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free";

export const providers: Record<string, Provider> = {
  vocab_generation: "openrouter",
  transcript_analysis: "openrouter",
  speech_evaluation: "openrouter",
  group_discussion: "openrouter",
  translation: "openrouter",
};

export const stats = {
  openrouterCount: 0,
  geminiCount: 0,
  openrouterErrors: 0,
  lastResetDate: new Date().toISOString().slice(0, 10),
  lastUsedProvider: {} as Record<string, string>,
};

export function resetStatsIfNeeded() {
  const today = new Date().toISOString().slice(0, 10);
  if (stats.lastResetDate !== today) {
    stats.openrouterCount = 0;
    stats.geminiCount = 0;
    stats.openrouterErrors = 0;
    stats.lastResetDate = today;
    stats.lastUsedProvider = {};
  }
}
