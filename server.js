import "dotenv/config";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 3000);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "32kb" }));
app.use(express.static(path.join(__dirname, "public")));

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "ခဏစောင့်ပြီးမှ ထပ်မေးပေးပါ။" }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, configured: Boolean(process.env.OPENAI_API_KEY) });
});

app.post("/api/chat", chatLimiter, async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        error: "AI API Key မထည့်ရသေးပါ။ Server ရဲ့ .env ဖိုင်ထဲမှာ OPENAI_API_KEY ထည့်ပေးပါ။"
      });
    }

    const messages = req.body?.messages;
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 30) {
      return res.status(400).json({ error: "Chat မှတ်တမ်း မမှန်ကန်ပါ။" });
    }

    const safeMessages = messages.map((m) => {
      if (!["user", "assistant"].includes(m?.role) || typeof m?.content !== "string") {
        throw new Error("မမှန်ကန်သော message format ဖြစ်ပါတယ်။");
      }
      return { role: m.role, content: m.content.slice(0, 8000) };
    });

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      instructions:
        "You are HHH AI, a helpful, friendly multilingual AI assistant. " +
        "Understand and respond in the language used by the user. " +
        "If the user asks for another language, follow that request. " +
        "Be clear, accurate, respectful, and admit uncertainty when needed.",
      input: safeMessages
    });

    res.json({ reply: response.output_text || "အဖြေမရရှိပါ။ ထပ်မေးကြည့်ပါ။" });
  } catch (error) {
    console.error("Chat API error:", error?.message || error);
    const status = error?.status && Number.isInteger(error.status) ? error.status : 500;
    res.status(status >= 400 && status < 600 ? status : 500).json({
      error: status === 401
        ? "API Key မမှန်ပါ။ Server ရဲ့ .env ကို စစ်ဆေးပါ။"
        : status === 429
          ? "AI ဝန်ဆောင်မှုကို ခဏတာ အများကြီးအသုံးပြုနေပါတယ်။ ခဏနေမှ ထပ်စမ်းပါ။"
          : "တောင်းဆိုမှု မအောင်မြင်ပါ။ Server နဲ့ API Key ကို စစ်ဆေးပါ။"
    });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`HHH AI is running at http://localhost:${port}`);
});
