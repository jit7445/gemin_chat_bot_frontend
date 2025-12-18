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

        const newMessages = [response.message]
        if (response.botMessage) {
          newMessages.push(response.botMessage)
        }

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, ...newMessages],
          isLoading: false,
        }))
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

  const clearMessages = useCallback(async () => {
    setState((prev) => ({ ...prev, messages: [], isLoading: true }))

    try {
      await api.resetChat()
      setState((prev) => ({ ...prev, isLoading: false }))
    } catch (error) {
      console.error("Error resetting chat:", error)
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearMessages,
  }
}
