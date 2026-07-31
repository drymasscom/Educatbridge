import type { Request, Response } from "express";
import { providers, type Provider } from "./_state";

export default function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { feature, provider } = req.body ?? {};
  if (typeof feature === "string" && feature in providers && (provider === "openrouter" || provider === "gemini")) {
    providers[feature] = provider as Provider;
  }

  return res.status(200).json({ success: true, providers });
}
