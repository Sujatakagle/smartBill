import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Bot,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config/api";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

export default function SmartAssistantChat() {
  const authContext = useContext(AuthContext);
  const token = authContext?.token;
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Ask me about your spending, categories, payment methods, or merchants.",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  if (!token) return null;

  const askAssistant = async (text: string) => {
    const cleanQuestion = text.trim();
    if (!cleanQuestion || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: cleanQuestion,
    };

    setMessages((current) => [...current, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/expense/assistant`,
        { question: cleanQuestion },
        { headers: { "x-auth-token": token } }
      );

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: res.data.answer || "I could not find an answer for that.",
        },
      ]);
    } catch (err: any) {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            err.response?.data?.msg ||
            "I could not reach the AI assistant. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    askAssistant(question);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[99999]">
      {isOpen && (
        <div className="mb-4 flex h-[520px] w-[calc(100vw-2rem)] max-w-[410px] flex-col overflow-hidden rounded-[1.35rem] border border-gray-200 bg-white shadow-[0_22px_70px_rgba(15,23,42,0.18)] ring-1 ring-black/[0.03] dark:border-gray-800 dark:bg-gray-950 dark:shadow-[0_22px_70px_rgba(0,0,0,0.45)]">
          <div className="border-b border-gray-100 bg-gray-50/80 px-4 py-4 dark:border-gray-800 dark:bg-gray-900/80">
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex size-11 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:text-brand-300 dark:ring-gray-700">
                <Sparkles className="size-5" />
                <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-gray-50 bg-emerald-500 dark:border-gray-900" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white">
                  Expenzoir Assistant
                </h3>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  Reads your saved expenses
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex size-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
              aria-label="Close assistant"
            >
              <X className="size-4" />
            </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto bg-white px-4 py-5 dark:bg-gray-950"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">
                    <Bot className="size-4" />
                  </span>
                )}
                <div
                  className={`max-w-[78%] whitespace-pre-line px-4 py-2.5 text-sm leading-6 shadow-sm ${
                    message.role === "user"
                      ? "rounded-2xl rounded-br-md bg-brand-500 text-white"
                      : "rounded-2xl rounded-bl-md border border-gray-200 bg-gray-50 text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
                  }`}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100 dark:bg-brand-500/15 dark:text-brand-300 dark:ring-brand-500/20">
                    <UserRound className="size-4" />
                  </span>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-end gap-2">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">
                  <Bot className="size-4" />
                </span>
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                  <Loader2 className="size-4 animate-spin" />
                  Checking your expenses...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-900/80">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask about your spending..."
                className="h-12 min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
              <button
                type="submit"
                disabled={!question.trim() || loading}
                className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-300"
                aria-label="Send question"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="group flex items-center gap-3 rounded-full bg-gray-900 px-4 py-3 text-white shadow-xl ring-1 ring-white/10 transition hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-brand-500/20 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        aria-label="Open Expenzoir assistant"
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-brand-500 text-white">
          {isOpen ? <X className="size-5" /> : <MessageCircle className="size-5" />}
        </span>
        <span className="hidden pr-1 text-left sm:block">
          <span className="block text-xs font-semibold leading-4">
            AI Assistant
          </span>
          <span className="block text-[11px] leading-4 text-white/65 dark:text-gray-500">
            Ask spending questions
          </span>
        </span>
      </button>
    </div>
  );
}
