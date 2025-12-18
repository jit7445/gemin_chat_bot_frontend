import type { SendMessageRequest, SendMessageResponse, UploadFileResponse } from "@/types/api"
import type { Message } from "@/types/chat"

// Mock API service - replace with actual API endpoints
export const api = {
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const message: Message = {
      id: `msg_${Date.now()}`,
      content: request.content,
      sender: "user",
      timestamp: new Date(),
      ...(request.file && {
        fileName: request.file.name,
        fileType: request.file.type,
        fileUrl: URL.createObjectURL(request.file),
      }),
    }

    return {
      message,
      success: true,
    }
  },

  async uploadFile(file: File): Promise<UploadFileResponse> {
    // Simulate file upload
    await new Promise((resolve) => setTimeout(resolve, 800))

    return {
      fileUrl: URL.createObjectURL(file),
      fileName: file.name,
      fileType: file.type,
    }
  },

  // Mock receiving a response message
  async getResponse(userMessage: string): Promise<Message> {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return {
      id: `msg_${Date.now()}_response`,
      content: `Got your message: "${userMessage}"`,
      sender: "other",
      timestamp: new Date(),
    }
  },
}
