"use client"

import { useState, useCallback } from "react"
import type { ChatState } from "@/types/chat"
import { api } from "@/services/api"

export function useChat(chatId: string) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  })

  const sendMessage = useCallback(
    async (content: string, file?: File) => {
      if (!content.trim() && !file) return

      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const response = await api.sendMessage({ chatId, content, file })

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, response.message],
          isLoading: false,
        }))

        // Simulate receiving a response
        setTimeout(async () => {
          const responseMessage = await api.getResponse(content)
          setState((prev) => ({
            ...prev,
            messages: [...prev.messages, responseMessage],
          }))
        }, 1000)
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Failed to send message",
        }))
      }
    },
    [chatId],
  )

  const clearMessages = useCallback(() => {
    setState((prev) => ({ ...prev, messages: [] }))
  }, [])

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearMessages,
  }
}
