import { gemini } from "../../lib/gemini";
import { redis } from "../../lib/redis";
import { ChatRequest } from "./chatbot.schema";

// ─── System Prompt ────────────────────────────────────────
//
// This strictly scopes what Gemini can discuss.
// It prevents the chatbot from:
// - Accessing or pretending to access user financial data
// - Giving financial/legal/investment advice
// - Discussing topics unrelated to PayYou


const SYSTEM_PROMPT = `You are PayYou Assistant, a helpful guide for the PayYou digital wallet app.

You help users understand how to use PayYou's features. You are friendly, concise, and clear.

WHAT YOU CAN HELP WITH:
- How to sign up and verify account via OTP
- How to send money to another user by username
- How to add money to wallet via card (Stripe)
- How to view transaction history and filter transactions
- Explaining wallet balance, daily limits, and remaining limits
- How to use the dashboard and navigate the app
- General troubleshooting (e.g. OTP not received, transaction failed)
- Account settings

STRICT RULES:
- You do NOT have access to any user's account, balance, transactions, or personal data
- Never make up or guess specific account details
- Do NOT give financial advice, investment advice, or legal advice
- Do NOT discuss topics unrelated to PayYou (e.g. cooking, politics, coding help)
- If asked about something outside your scope, politely redirect to PayYou topics
- Keep responses concise — under 150 words unless a detailed explanation is needed
- Use simple, clear language suitable for all users`;

// ─── CHAT SERVICE ─────────────────────────────────────────

export const chatService = async (userId: string, data: ChatRequest) => {
  const { message, history } = data;

  // ── Rate Limiting ──────────────────────────────────────
  // Allow max 10 messages per user per minute
  // Uses Redis INCR + EXPIRE pattern:
  // - First request in window: set key + TTL
  // - Subsequent requests: increment counter
  // - If counter > 10: reject

  const rateLimitKey = `rate:chat:${userId}`;
  const requestCount = await redis.incr(rateLimitKey);

  if (requestCount === 1) {
    // First request in this window — set 60s TTL
    await redis.expire(rateLimitKey, 60);
  }

  if (requestCount > 10) {
    // Get remaining TTL to tell user when to retry
    const ttl = await redis.ttl(rateLimitKey);
    throw new Error(`RATE_LIMIT:${ttl}`);
  }

  // ── Build Gemini model ─────────────────────────────────
  const model = gemini.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  // ── Build conversation history for Gemini ──────────────
  // Gemini expects history in { role, parts: [{ text }] } format
  // We convert our simpler { role, content } format to this
  const geminiHistory = history.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));

  // ── Start chat session with history ───────────────────
  // Gemini is stateless — we must send full history each time
  // startChat() initializes the session with previous context
  const chat = model.startChat({
    history: geminiHistory,
  });

  // ── Send current message ───────────────────────────────
  const result = await chat.sendMessage(message);
  const responseText = result.response.text();

  return {
    response: responseText,
    // Return remaining requests for frontend to show rate limit info
    remainingRequests: Math.max(0, 10 - requestCount),
  };
};
