import type { Request, Response } from "express";
import { OPENROUTER_MODEL, providers, resetStatsIfNeeded, stats } from "./_state";

export default function handler(_req: Request, res: Response) {
  resetStatsIfNeeded();
  res.status(200).json({
    providers,
    stats,
    openrouterKeyConfigured: Boolean(process.env.OPENROUTER_API_KEY),
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    openrouterModel: OPENROUTER_MODEL,
  });
}
