import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import api from "../api/axiosInstance";

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
  isError?: boolean;
}

interface HistoryItem {
  role: "user" | "model";
  content: string;
}

// ─── Suggested questions shown before first message ───────
const SUGGESTED_QUESTIONS = [
  "How do I send money?",
  "How do I add money to my wallet?",
  "What is the daily transfer limit?",
  "How do I view my transactions?",
];

const ChatBot = () => {
  const user = useSelector((s: RootState) => s.user);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitMsg, setRateLimitMsg] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // send message
  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setRateLimitMsg("");
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    // Optimistically add user message
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Build history from current messages to send to backend
    // Exclude error messages from history — they are UI-only
    const history: HistoryItem[] = messages
      .filter((m) => !m.isError)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const { data } = await api.post("/chatbot/message", {
        message: text.trim(),
        history,
      });

      const botMessage: Message = {
        id: crypto.randomUUID(),
        role: "model",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const message = err.response?.data?.message;

        if (status === 429) {
          // Rate limited — show countdown message
          setRateLimitMsg(message || "Too many messages. Please wait.");
          // Remove the user message that caused the rate limit
          setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
        } else {
          // Show error as a bot message in the chat
          const errorMessage: Message = {
            id: crypto.randomUUID(),
            role: "model",
            content: message || "Something went wrong. Please try again.",
            timestamp: new Date(),
            isError: true,
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      }
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleSuggestion = (question: string) => {
    sendMessage(question);
  };

  const clearChat = () => {
    setMessages([]);
    setRateLimitMsg("");
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50
          flex items-center justify-center text-white text-2xl cursor-pointer
          transition-all duration-200
          ${isOpen ? "bg-gray-600 hover:bg-gray-700" : "bg-brand-600 hover:bg-brand-700"}
        `}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-130 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-brand-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm">
                🤖
              </div>
              <div>
                <p className="text-white font-semibold text-sm">
                  PayYou Assistant
                </p>
                <p className="text-brand-200 text-xs">Powered by Gemini</p>
              </div>
            </div>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="text-brand-200 hover:text-white text-xs transition cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {/* Welcome message */}
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-2xl rounded-tl-none px-4 py-3">
                  <p className="text-sm text-gray-700">
                    Hi {user.fullName?.split(" ")[0]} 👋 I'm your PayYou
                    Assistant. I can help you understand how to use the app.
                    What would you like to know?
                  </p>
                </div>

                {/* Suggested questions */}
                <div className="space-y-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSuggestion(q)}
                      className="w-full text-left text-sm text-brand-600 border border-brand-200 rounded-xl px-3 py-2 hover:bg-brand-50 transition cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
                    max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
                    ${
                      msg.role === "user"
                        ? "bg-brand-600 text-white rounded-tr-none"
                        : msg.isError
                          ? "bg-red-50 text-red-600 rounded-tl-none border border-red-100"
                          : "bg-gray-100 text-gray-800 rounded-tl-none"
                    }
                  `}
                >
                  {/* Render line breaks from Gemini response */}
                  {msg.content.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < msg.content.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                  <p
                    className={`text-xs mt-1 ${
                      msg.role === "user" ? "text-brand-200" : "text-gray-400"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {/* Rate limit warning */}
            {rateLimitMsg && (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-2 rounded-lg text-center">
                ⏳ {rateLimitMsg}
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-gray-100 px-3 py-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about PayYou..."
                maxLength={500}
                disabled={isLoading}
                className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-gray-50 disabled:text-gray-400"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={isLoading || !input.trim()}
                className="w-9 h-9 bg-brand-600 hover:bg-brand-700 rounded-xl flex items-center justify-center text-white transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              PayYou Assistant · Feature guide only
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
