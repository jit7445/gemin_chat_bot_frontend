export interface Message {
  id: string
  content: string
  sender: "user" | "other"
  timestamp: Date
  fileUrl?: string
  fileName?: string
  fileType?: string
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
}
