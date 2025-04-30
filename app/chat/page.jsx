"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, BookOpen, Brain, FileText, MessageSquare, Mic, Send } from "lucide-react"

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      content: "Hello! I'm your AI study assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [language, setLanguage] = useState("english")
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const messagesEndRef = useRef(null)

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      let botResponse = ""

      if (input.toLowerCase().includes("recursion")) {
        botResponse =
          "Recursion is a programming concept where a function calls itself. It's useful for solving problems that can be broken down into smaller, similar subproblems. Every recursive solution needs a base case to prevent infinite recursion."
      } else if (input.toLowerCase().includes("data structure")) {
        botResponse =
          "Data structures are specialized formats for organizing and storing data. Common data structures include arrays, linked lists, stacks, queues, trees, and graphs. Each has specific use cases and performance characteristics."
      } else if (input.toLowerCase().includes("algorithm")) {
        botResponse =
          "Algorithms are step-by-step procedures for solving problems. They're the foundation of computer science and are evaluated based on time complexity (how long they take) and space complexity (how much memory they use)."
      } else {
        botResponse =
          "That's an interesting question! Based on your field of study, I'd recommend focusing on understanding the core concepts first before diving into more complex topics. Would you like me to explain any specific concept in more detail?"
      }

      const botMessage = {
        id: Date.now().toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleVoice = () => {
    setIsVoiceActive(!isVoiceActive)
    // In a real app, this would activate speech recognition
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden w-72 p-6 border-r border-border md:block">
        <div className="flex items-center mb-10 space-x-3">
          <Brain className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">StudyAI</h1>
        </div>
        <nav className="space-y-3">
          <Link href="/dashboard" className="flex items-center w-full p-3 text-lg rounded-lg hover:bg-accent">
            <FileText className="w-6 h-6 mr-4" />
            Dashboard
          </Link>
          <Link href="/summarizer" className="flex items-center w-full p-3 text-lg rounded-lg hover:bg-accent">
            <BookOpen className="w-6 h-6 mr-4" />
            Summarizer
          </Link>
          <Link href="/test" className="flex items-center w-full p-3 text-lg rounded-lg hover:bg-accent">
            <Brain className="w-6 h-6 mr-4" />
            Test
          </Link>
          <Link href="/chat" className="flex items-center w-full p-3 text-lg rounded-lg bg-accent text-primary">
            <MessageSquare className="w-6 h-6 mr-4" />
            AI Chat
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center p-6 border-b border-border">
          <Link href="/dashboard" className="mr-4">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">AI Chat Bot</h1>
          <div className="flex items-center ml-auto">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[200px] text-lg h-12">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english" className="text-lg">
                  English
                </SelectItem>
                <SelectItem value="spanish" className="text-lg">
                  Spanish
                </SelectItem>
                <SelectItem value="french" className="text-lg">
                  French
                </SelectItem>
                <SelectItem value="german" className="text-lg">
                  German
                </SelectItem>
                <SelectItem value="chinese" className="text-lg">
                  Chinese
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-4 text-lg ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-accent-foreground"
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                  <p className="mt-2 text-sm opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-6 border-t border-border">
          <div className="flex items-center gap-3">
            <Button
              variant={isVoiceActive ? "default" : "outline"}
              size="icon"
              onClick={toggleVoice}
              className="shrink-0 h-14 w-14"
            >
              <Mic className="w-6 h-6" />
            </Button>
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 h-14 text-lg px-4"
            />
            <Button onClick={handleSendMessage} disabled={!input.trim()} className="shrink-0 h-14 px-6 text-lg">
              <Send className="w-6 h-6 mr-2" />
              Send
            </Button>
          </div>
          <div className="mt-3 text-sm text-center text-muted-foreground">
            {isVoiceActive ? "Voice input is active. Speak now..." : "Type or use voice input to ask questions"}
          </div>
        </div>
      </div>
    </div>
  )
}
