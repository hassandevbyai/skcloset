"use client"

import { useState, useRef, useEffect } from "react"
import { ChatIcon, XIcon } from "@/components/layout/Icons"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: number
}

const STORAGE_KEY = "skcloset_chat"

const predefinedResponses: Record<string, string> = {
  hello: "Welcome to SKCLOSET! How can I help you today? Browse our latest drops, check order status, or get sizing advice — just ask.",
  hi: "Hey there! Need help finding the perfect piece? Let me know what you're looking for.",
  help: "I'm here to help! You can ask me about:\n• Order status & tracking\n• Returns & exchanges\n• Sizing & fit\n• Shipping info\n• Product recommendations\n\nWhat would you like to know?",
  order: "To check your order status, visit your Account page and click 'Orders.' Need your order number? Check the confirmation email we sent you.",
  return: "We accept returns within 30 days of delivery. Items must be unworn with tags attached. Visit our Returns page for a prepaid shipping label.",
  size: "Check our Size Guide for detailed measurements. As a rule: our shirts run true to size, jackets fit slightly relaxed, and footwear matches standard US sizing.",
  shipping: "Free shipping on orders over $200. Standard delivery takes 3-5 business days. Express shipping (1-2 days) is available for $15.",
  payment: "We accept Visa, Mastercard, Amex, PayPal, and Apple Pay. All transactions are secured with Stripe.",
  recommend: "What's your vibe? We've got:\n• Old Money — Polo RL, Loro Piana-inspired knits\n• Streetwear — Supreme, Nike SB, Represent\n• Smart Casual — Minimalist fits for everyday\n\nTell me your style and I'll point you to the right section.",
  contact: "You can reach us at support@skcloset.com. We typically respond within 24 hours.",
}

function getBotResponse(input: string): string {
  const lower = input.toLowerCase()
  for (const [keyword, response] of Object.entries(predefinedResponses)) {
    if (lower.includes(keyword)) return response
  }
  return "Thanks for reaching out! For specific questions about orders, returns, or products, email us at support@skcloset.com and we'll get back to you within 24 hours."
}

function getStoredMessages(): Message[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function storeMessages(messages: Message[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
}

export function LiveChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [mounted, setMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
    const stored = getStoredMessages()
    if (stored.length === 0) {
      const welcome: Message = {
        id: generateId(),
        text: "Hi! I'm the SKCLOSET assistant. Ask me about orders, sizing, shipping, or get product recommendations.",
        sender: "bot",
        timestamp: Date.now(),
      }
      setMessages([welcome])
      storeMessages([welcome])
    } else {
      setMessages(stored)
    }
  }, [])

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function handleSend() {
    const text = input.trim()
    if (!text) return

    const userMsg: Message = { id: generateId(), text, sender: "user", timestamp: Date.now() }
    const updated = [...messages, userMsg]
    setMessages(updated)
    storeMessages(updated)
    setInput("")

    const botMsg: Message = {
      id: generateId(),
      text: getBotResponse(text),
      sender: "bot",
      timestamp: Date.now(),
    }

    setTimeout(() => {
      const withBot = [...updated, botMsg]
      setMessages(withBot)
      storeMessages(withBot)
    }, 600)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSend()
  }

  function handleClear() {
    localStorage.removeItem(STORAGE_KEY)
    setMessages([])
  }

  if (!mounted) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 transition-all hover:scale-105 active:scale-95"
        aria-label="Open chat"
      >
        <ChatIcon className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-end justify-end p-0 sm:p-5 pointer-events-none">
          <div
            className="pointer-events-auto w-full sm:w-[380px] h-[85dvh] sm:h-[560px] bg-background border border-border shadow-2xl flex flex-col animate-in slide-in-from-bottom-2 sm:rounded-2xl overflow-hidden"
            style={{ animation: "slideUp 0.3s ease-out" }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-secondary/30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
                  <ChatIcon className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">SKCLOSET Support</p>
                  <p className="text-[11px] text-muted-foreground">Online — Typically replies instantly</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClear}
                  className="text-[10px] tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                >
                  Clear
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close chat"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 scroll-smooth">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-accent text-accent-foreground rounded-2xl rounded-br-md"
                        : "bg-secondary text-foreground rounded-2xl rounded-bl-md"
                    }`}
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border p-4 shrink-0">
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm rounded-xl focus:outline-none focus:border-accent/50 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="px-5 py-3 bg-accent text-accent-foreground text-sm font-medium rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInFromBottom {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: slideInFromBottom 0.2s ease-out; }
        .slide-in-from-bottom-2 { animation-name: slideInFromBottom; }
      `}</style>
    </>
  )
}
