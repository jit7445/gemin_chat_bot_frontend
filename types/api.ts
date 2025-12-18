import type { Message } from "./chat"

export interface SendMessageRequest {
  chatId: string
  content: string
  file?: File
}

export interface SendMessageResponse {
  message: Message
  botMessage?: Message 
  success: boolean
}

export interface UploadFileResponse {
  fileUrl: string
  fileName: string
  fileType: string
}
