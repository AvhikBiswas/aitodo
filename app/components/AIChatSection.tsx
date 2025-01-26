"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, User, Bot } from "lucide-react"
import { Task } from "../types/task"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface AIChatSectionProps {
  onTasksGenerated: (tasks: any[]) => void
}

export default function AIChatSection({ onTasksGenerated }: AIChatSectionProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [scrollAreaRef])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Get existing tasks for context
      const existingTasks: Task[] = [] // You can pass existing tasks here if needed

      // Call tasks API with text and existing tasks
      const response = await axios.post("/api/tasks", { 
        text: input,
        tasks: existingTasks
      })

      const aiMessage: Message = { role: "assistant", content: response.data.messageForUser }
      setMessages((prev) => [...prev, aiMessage])

      if (response.data.data && Array.isArray(response.data.data)) {
        onTasksGenerated(response.data.data)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = { role: "assistant", content: "Sorry, there was an error processing your request." }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">AI Chat</h2>
      </div>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-2 mb-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
            )}
            <div className={`p-2 rounded-lg max-w-[70%] ${message.role === "user" ? "bg-blue-100" : "bg-gray-100"}`}>
              {message.content}
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
          </div>
        )}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
