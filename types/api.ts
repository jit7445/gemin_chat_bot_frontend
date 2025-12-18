import type { Message } from "./message" // Assuming Message is declared in another file

export interface SendMessageRequest {
  chatId: string
  content: string
  file?: File
}

export interface SendMessageResponse {
  message: Message
  success: boolean
}

export interface UploadFileResponse {
  fileUrl: string
  fileName: string
  fileType: string
}
