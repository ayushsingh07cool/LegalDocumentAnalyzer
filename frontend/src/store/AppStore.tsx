import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Source } from "@/lib/api"

export interface UploadedDoc {
  pdfName: string
  originalName: string
  size: number
  uploadedAt: number
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  /** For user messages: the raw question text. For assistant: the raw answer. */
  content: string
  /** Which document this message was scoped to (null = all documents). */
  pdfName: string | null
  sources?: Source[]
  isError?: boolean
  createdAt: number
}

interface AppState {
  docs: UploadedDoc[]
  messages: ChatMessage[]
  addDoc: (doc: UploadedDoc) => void
  removeDoc: (pdfName: string) => void
  addMessage: (msg: Omit<ChatMessage, "id" | "createdAt"> & { id?: string }) => string
  updateMessage: (id: string, patch: Partial<ChatMessage>) => void
  clearMessages: () => void
}

const DOCS_KEY = "semanticpdf.docs"
const MESSAGES_KEY = "semanticpdf.messages"

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [docs, setDocs] = useState<UploadedDoc[]>(() => load<UploadedDoc[]>(DOCS_KEY, []))
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    load<ChatMessage[]>(MESSAGES_KEY, []),
  )

  useEffect(() => {
    localStorage.setItem(DOCS_KEY, JSON.stringify(docs))
  }, [docs])

  useEffect(() => {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
  }, [messages])

  const addDoc = useCallback((doc: UploadedDoc) => {
    setDocs((prev) => {
      const withoutDupe = prev.filter((d) => d.pdfName !== doc.pdfName)
      return [doc, ...withoutDupe]
    })
  }, [])

  const removeDoc = useCallback((pdfName: string) => {
    setDocs((prev) => prev.filter((d) => d.pdfName !== pdfName))
  }, [])

  const addMessage = useCallback(
    (msg: Omit<ChatMessage, "id" | "createdAt"> & { id?: string }) => {
      const id = msg.id ?? makeId()
      setMessages((prev) => [...prev, { ...msg, id, createdAt: Date.now() }])
      return id
    },
    [],
  )

  const updateMessage = useCallback((id: string, patch: Partial<ChatMessage>) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  }, [])

  const clearMessages = useCallback(() => setMessages([]), [])

  const value = useMemo<AppState>(
    () => ({
      docs,
      messages,
      addDoc,
      removeDoc,
      addMessage,
      updateMessage,
      clearMessages,
    }),
    [docs, messages, addDoc, removeDoc, addMessage, updateMessage, clearMessages],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppStore(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useAppStore must be used within an AppProvider")
  return ctx
}
