import type { SendMessageRequest, SendMessageResponse } from "@/types/api"
import type { Message } from "@/types/chat"

const API_BASE_URL = "http://localhost:7777"

export const api = {
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      // Create user message immediately
      const userMessage: Message = {
        id: `msg_${Date.now()}`,
        content: request.content,
        sender: "user",
        timestamp: new Date(),
      }

      let botResponse: any

      // Handle file uploads (image or document)
      if (request.file) {
        const formData = new FormData()
        const fileType = request.file.type

        // Determine endpoint based on file type
        let endpoint: string
        let fileKey: string

        if (fileType.startsWith("image/")) {
          endpoint = `${API_BASE_URL}/api/chat/image`
          fileKey = "image"
        } else if (fileType === "application/pdf" || fileType === "text/plain") {
          endpoint = `${API_BASE_URL}/api/chat/document`
          fileKey = "file"
        } else {
          throw new Error(`Unsupported file type: ${fileType}`)
        }

        formData.append(fileKey, request.file)

        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`)
        }

        botResponse = await response.json()

        // Add file info to user message
        userMessage.fileName = request.file.name
        userMessage.fileType = request.file.type
        userMessage.fileUrl = URL.createObjectURL(request.file)
      }
      // Handle text messages
      else if (request.content.trim()) {
        const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: request.content,
          }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`)
        }

        botResponse = await response.json()
      }

      // Create bot response message
      const botMessage: Message = {
        id: `msg_${Date.now()}_bot`,
        content: botResponse?.reply || "No response from bot",
        sender: "other",
        timestamp: new Date(),
      }

      return {
        message: userMessage,
        botMessage,
        success: true,
      }
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  },

  async resetChat(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/reset`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error(`Reset error: ${response.statusText}`)
      }
    } catch (error) {
      console.error("Error resetting chat:", error)
      throw error
    }
  },
}
