export interface ChatMessage {
  role: Role
  content: string
}

export interface Prompt {
  content: string
  desc: string
  options: {
    io?: AIActionIO[]
    temperature?: number
    model?: Model
    max_tokens?: number
  }
}

export type Role = "system" | "user" | "assistant"
export type Model = "gpt-3.5-turbo-1106" | "gpt-4" | "gpt-4-32k"

export const enum AIActionIO {
  title2title,
  title2comment,
  excerpt2title,
  excerpt2comment,
  card2title,
  card2tag,
  card2comment,
  selected_text
}
