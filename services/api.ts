import type { SendMessageRequest, SendMessageResponse } from "@/types/api"
import type { Message } from "@/types/chat"

const API_BASE_URL = "http://localhost:7777"

export const api = {
  async sendMessage(
    request: SendMessageRequest
  ): Promise<SendMessageResponse> {
    try {
      // Create user message immediately
      const userMessage: Message = {
        id: `msg_${Date.now()}`,
        content: request.content,
        sender: "user",
        timestamp: new Date(),
      }

      // 1️⃣ Upload file first (if exists)
      if (request.file) {
        const formData = new FormData()
        const fileType = request.file.type

        let endpoint = ""
        let fileKey = ""

        if (fileType.startsWith("image/")) {
          endpoint = `${API_BASE_URL}/api/chat/image`
          fileKey = "image"
        } else if (
          fileType === "application/pdf" ||
          fileType === "text/plain"
        ) {
          endpoint = `${API_BASE_URL}/api/chat/document`
          fileKey = "file"
        } else {
          throw new Error(`Unsupported file type: ${fileType}`)
        }

        formData.append(fileKey, request.file)

        const uploadRes = await fetch(endpoint, {
          method: "POST",
          body: formData,
        })

        if (!uploadRes.ok) {
          throw new Error("File upload failed")
        }
        userMessage.fileName = request.file.name
        userMessage.fileType = request.file.type
        userMessage.fileUrl = URL.createObjectURL(request.file)
      }
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

      const botResponse = await response.json()

      const botMessage: Message = {
        id: `msg_${Date.now()}_bot`,
        content: botResponse.reply ?? "No response from bot",
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
    const response = await fetch(`${API_BASE_URL}/api/chat/reset`, {
      method: "POST",
    })

    if (!response.ok) {
      throw new Error(`Reset error: ${response.statusText}`)
    }
  },
}
