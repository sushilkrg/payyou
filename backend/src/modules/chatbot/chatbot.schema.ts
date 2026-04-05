import { z } from "zod";

//  Each message in conversation history
export const chatMessageSchema = z.object({
  role: z.enum(["user", "model"]),
  content: z.string().min(1).max(2000),
});

// Request body — current message + full conversation history
export const chatRequestSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(500, "Message too long"),

  // Frontend sends full history so Gemini has context
  // We cap at last 20 messages to avoid token limit issues
  history: z
    .array(chatMessageSchema)
    .max(20, "History too long")
    .optional()
    .default([]),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
