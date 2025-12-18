"use client"

import type { Message } from "@/types/chat"
import { cn } from "@/lib/utils"
import { FileIcon, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImagePreview } from "./image-preview"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user"
  const time = message.timestamp.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const isImage = message.fileType?.startsWith("image/")

  return (
    <div className={cn("flex w-full items-end gap-2", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "flex max-w-[70%] flex-col gap-2 rounded-2xl px-4 py-2.5",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-card text-card-foreground border border-border rounded-bl-sm",
        )}
      >
        {/* 🧑 User text → plain */}
        {message.content && isUser && (
          <p className="text-sm leading-relaxed break-words">{message.content}</p>
        )}

        {/* 🤖 Bot text → Markdown */}
        {message.content && !isUser && (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-base font-semibold mb-2">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-sm font-semibold mb-2">{children}</h2>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 space-y-1">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-5 space-y-1">{children}</ol>
              ),
              li: ({ children }) => <li className="text-sm">{children}</li>,
              p: ({ children }) => (
                <p className="text-sm leading-relaxed mb-2 last:mb-0">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}

        {/* 📎 File preview */}
        {message.fileUrl && (
          <div className="mt-1">
            {isImage ? (
              <ImagePreview
                src={message.fileUrl || "/placeholder.svg"}
                alt={message.fileName || "Image"}
              />
            ) : (
              <div className="flex items-center gap-2 rounded-lg bg-background/50 px-3 py-2">
                <FileIcon className="h-4 w-4" />
                <span className="text-xs flex-1 truncate">
                  {message.fileName}
                </span>
                <Button size="icon" variant="ghost" className="h-6 w-6">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ⏰ Time */}
        <span
          className={cn(
            "text-xs mt-1",
            isUser ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {time}
        </span>
      </div>
    </div>
  )
}
