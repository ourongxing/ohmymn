export interface ChatMessage {
  role: Role
  content: string
}

export type Role = "system" | "user" | "assistant"

export const Module = {
  0: "gpt-3.5-turbo",
  1: "gpt-4",
  2: "gpt-4-32k"
}
