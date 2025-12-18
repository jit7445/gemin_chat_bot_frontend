"use client"

import type React from "react"
import { useState, type FormEvent } from "react"
import { Send } from "lucide-react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { FileUpload } from "./file-upload"

interface InputBarProps {
  onSendMessage: (content: string, file?: File) => void
  isLoading?: boolean
}

export function InputBar({ onSendMessage, isLoading }: InputBarProps) {
  const [message, setMessage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleSubmit = (e: FormEvent) => {
    console.log("Submitting message:", message, "with file:", selectedFile);
    e.preventDefault()
    if (message.trim() || selectedFile) {
      onSendMessage(message, selectedFile || undefined)
      setMessage("")
      setSelectedFile(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-background p-4">
      <div className="flex items-end gap-2">
        <FileUpload onFileSelect={setSelectedFile} selectedFile={selectedFile} />

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="min-h-[44px] max-h-32 resize-none"
          rows={1}
        />

        <Button
          type="submit"
          size="icon"
          disabled={isLoading || (!message.trim() && !selectedFile)}
          className="h-11 w-11 flex-shrink-0"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  )
}
