import type { Request, Response } from "express";
import { stats } from "../_admin-state";

export default function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  stats.openrouterCount = 0;
  stats.geminiCount = 0;
  stats.openrouterErrors = 0;
  stats.lastUsedProvider = {};
  stats.lastResetDate = new Date().toISOString().slice(0, 10);
  return res.status(200).json({ success: true, stats });
}
