import axios, { type AxiosProgressEvent } from "axios"


declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

export const API_URL = import.meta.env.VITE_API_URL ?? "https://legaldocumentanalyzer-38mu.onrender.com"

export const api = axios.create({
  baseURL: API_URL,
})

export interface UploadResult {
  /** Best-effort identifier for the uploaded document. Falls back to the
   *  original filename since the backend response shape isn't finalized. */
  pdfName: string
  raw: unknown
}

export interface Source {
  score: number
  text: string
}

export interface ChatResponse {
  success: boolean
  answer: string
  sources: Source[]
}

/** Extract a human-readable error message from an axios error. */
export function getErrorMessage(err: unknown, fallback = "Something went wrong."): string {
  if (axios.isAxiosError(err)) {
    if (err.response) {
      const data = err.response.data as { detail?: string; message?: string } | undefined
      return (
        data?.detail ||
        data?.message ||
        `Server error (${err.response.status}). Please try again.`
      )
    }
    if (err.request) {
      return "Unable to reach the server. Please check your internet connection and try again."
    }
  }
  if (err instanceof Error) return err.message
  return fallback
}

export async function uploadPdf(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<UploadResult> {
  const formData = new FormData()
  formData.append("file", file)

  const res = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (evt: AxiosProgressEvent) => {
      if (onProgress && evt.total) {
        onProgress(Math.round((evt.loaded * 100) / evt.total))
      }
    },
  })

  // The backend response shape isn't finalized. Try a few likely fields,
  // then fall back to the original filename.
  const data = res.data as Record<string, unknown> | undefined
  const pdfName =
    (typeof data?.pdfName === "string" && data.pdfName) ||
    (typeof data?.filename === "string" && data.filename) ||
    (typeof data?.name === "string" && data.name) ||
    file.name

  return { pdfName, raw: res.data }
}

export async function askQuestion(
  question: string,
  pdfName: string | null,
): Promise<ChatResponse> {
  const res = await api.post<ChatResponse>("/chat", {
    question,
    pdfName: pdfName ?? null,
  })
  return res.data
}
