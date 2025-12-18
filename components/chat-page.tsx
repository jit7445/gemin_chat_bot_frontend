"use client"

import { useState } from "react"
import { ChatWindow } from "./chat-window"
import { InputBar } from "./input-bar"
import { useChat } from "@/hooks/use-chat"
import { generateChatId } from "@/utils/generate-chat-id"
import { MessageSquare } from "lucide-react"

export function ChatPage() {
  const [chatId] = useState(() => generateChatId())
  const { messages, isLoading, sendMessage } = useChat(chatId)

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Messenger</h1>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </header>
      <ChatWindow messages={messages} isLoading={isLoading} />
      <InputBar onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  )
}
