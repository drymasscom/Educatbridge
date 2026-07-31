import type { Request, Response } from "express";
import { OPENROUTER_MODEL } from "./_state";

async function testOpenRouter() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not configured.");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://educatbridge.vercel.app",
      "X-Title": "EduBridge HK Admin Console",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [{ role: "user", content: "How many r's are in the word 'strawberry'? Answer in 1 short sentence." }],
      max_tokens: 80,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || `HTTP ${response.status}`);
  return {
    output: data?.choices?.[0]?.message?.content || "OpenRouter responded successfully.",
    model: data?.model || OPENROUTER_MODEL,
  };
}

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: "Respond with 'Gemini API operational' in 1 sentence." }] }] }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || `HTTP ${response.status}`);
  return data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("") || "Gemini responded successfully.";
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const startTime = Date.now();
  const provider = req.body?.provider;
  try {
    if (provider === "openrouter") {
      const result = await testOpenRouter();
      return res.status(200).json({ success: true, message: `Successfully connected to OpenRouter (model: ${result.model}).`, responseTimeMs: Date.now() - startTime, sampleOutput: result.output, modelUsed: result.model });
    }
    if (provider === "gemini") {
      const output = await testGemini();
      return res.status(200).json({ success: true, message: "Successfully connected to Google Gemini API (gemini-2.5-flash).", responseTimeMs: Date.now() - startTime, sampleOutput: output });
    }
    return res.status(400).json({ success: false, message: "Unknown provider." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ success: false, message: `${provider === "gemini" ? "Gemini" : "OpenRouter"} connection failed: ${message}` });
  }
}
