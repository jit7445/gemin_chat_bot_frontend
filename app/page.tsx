"use client"

import { ChatWindow } from "@/components/chat-window"
import { InputBar } from "@/components/input-bar"
import { useChat } from "@/hooks/use-chat"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateChatId } from "@/utils/generate-chat-id"
import { useState, useCallback } from "react"
import { MessageSquarePlus } from "lucide-react"

export default function Home() {
  const [chatId, setChatId] = useState(() => generateChatId())
  const { messages, isLoading, sendMessage, clearMessages } = useChat(chatId)

  const handleNewChat = useCallback(() => {
    clearMessages()
    setChatId(generateChatId())
  }, [clearMessages])

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-4xl h-[600px] flex flex-col overflow-hidden shadow-lg">
        <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Chat Application</h1>
            <p className="text-sm text-muted-foreground">Send messages and share files</p>
          </div>
          <Button onClick={handleNewChat} variant="outline" size="sm" className="gap-2 bg-transparent">
            <MessageSquarePlus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        <ChatWindow messages={messages} isLoading={isLoading} />

        <InputBar onSendMessage={sendMessage} isLoading={isLoading} />
      </Card>
    </main>
  )
}
