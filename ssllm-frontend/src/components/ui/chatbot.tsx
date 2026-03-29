"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  Lightbulb,
  BookOpen,
  Target,
  Calendar,
  AlertCircle
} from "lucide-react"
import { sendChatMessage } from "@/lib/api"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  suggestions?: string[]
}

const quickActions = [
  { icon: BookOpen, label: "Learning Resources", query: "What learning resources do you recommend?" },
  { icon: Target, label: "Skill Assessment", query: "Can you assess my current skill level?" },
  { icon: Calendar, label: "Schedule Help", query: "Help me plan my learning schedule" },
  { icon: Lightbulb, label: "Career Advice", query: "What career path should I consider?" }
]

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI learning assistant. I can help you with skill assessments, learning recommendations, career advice, and more. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
      suggestions: ["What skills should I learn next?", "How can I improve my progress?", "Recommend a learning path"]
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (query?: string) => {
    const textToSend = query || inputValue
    if (!textToSend.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      // Map history to format Gemini expects (role: "user" | "model", parts: [{ text: string }])
      // Exclude the initial welcome message from the history to avoid the role mismatch error
      const history = messages
        .filter(m => m.id !== "1")
        .map(m => ({
          role: m.sender === "user" ? "user" : "model",
          parts: [{ text: m.text }]
        }))

      const result = await sendChatMessage(textToSend, history)
      
      const botMessage: Message = {
        id: Date.now().toString(),
        text: result.text,
        sender: "bot",
        timestamp: new Date(),
        suggestions: ["Explain more", "Show examples", "Thank you!"]
      }
      setMessages(prev => [...prev, botMessage])
    } catch (err: any) {
      console.error("Chatbot failed:", err)
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Sorry, I am having trouble connecting to my brain. Please make sure the API key is set correctly.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickAction = (query: string) => {
    handleSendMessage(query)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-14 h-14 shadow-xl shadow-primary/20 p-0 flex items-center justify-center bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 border-0"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Bot className="h-7 w-7 text-white" />
          )}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-96 h-[600px] max-h-[80vh]"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="h-full flex flex-col glass-effect">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Learning Assistant
                  <div className="ml-auto flex items-center gap-2">
                    <Badge variant="secondary">Online</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setIsOpen(false)}
                      title="Minimize chat"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Quick Actions */}
                {messages.length === 1 && (
                  <div className="p-4 border-b">
                    <p className="text-sm text-muted-foreground mb-3">Quick Actions:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {quickActions.map((action, index) => {
                        const Icon = action.icon
                        return (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAction(action.query)}
                            className="h-auto p-2 flex flex-col gap-1"
                          >
                            <Icon className="h-4 w-4" />
                            <span className="text-xs">{action.label}</span>
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.sender === "bot" && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] ${message.sender === "user" ? "order-first" : ""}`}>
                        <div
                          className={`rounded-lg p-3 ${
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground ml-auto"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                        
                        {message.suggestions && (
                          <div className="mt-2 space-y-1">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuickAction(suggestion)}
                                className="h-auto p-1 text-xs justify-start"
                              >
                                💡 {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                        
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                      
                      {message.sender === "user" && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Ask me anything about your learning..."
                      className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      disabled={isTyping}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleSendMessage()}
                      disabled={!inputValue.trim() || isTyping}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
