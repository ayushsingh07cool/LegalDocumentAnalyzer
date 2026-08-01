import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  AlertCircle,
  Files,
  FileText,
  MessagesSquare,
  SendHorizonal,
  Trash2,
  Upload,
} from "lucide-react"
import DocSelector from "@/components/DocSelector"
import AnswerCard from "@/components/AnswerCard"
import AnswerSkeleton from "@/components/AnswerSkeleton"
import SourcesPanel from "@/components/SourcesPanel"
import { Button } from "@/components/ui/Button"
import { askQuestion, getErrorMessage } from "@/lib/api"
import { useAppStore } from "@/store/AppStore"

const SUGGESTIONS = [
  "What are the key obligations in this document?",
  "Are there any termination or cancellation clauses?",
  "What are the biggest risks I should be aware of?",
  "Summarize the payment terms.",
]

export default function ChatPage() {
  const { docs, messages, addMessage, updateMessage, clearMessages } = useAppStore()
  const [searchParams, setSearchParams] = useSearchParams()

  // Scope: null = all documents. Initialize from ?pdf= query param if present & valid.
  const initialScope = useMemo(() => {
    const param = searchParams.get("pdf")
    if (param && docs.some((d) => d.pdfName === param)) return param
    return null
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [scope, setScope] = useState<string | null>(initialScope)
  const [question, setQuestion] = useState("")
  const [loading, setLoading] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Clear the query param once consumed so refreshes don't re-pin scope.
  useEffect(() => {
    if (searchParams.get("pdf")) {
      searchParams.delete("pdf")
      setSearchParams(searchParams, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, loading])

  const handleSubmit = useCallback(
    async (raw: string) => {
      const text = raw.trim()
      if (!text || loading) return

      setQuestion("")
      addMessage({ role: "user", content: text, pdfName: scope })
      setLoading(true)

      const scopeForRequest = scope
      try {
        const res = await askQuestion(text, scopeForRequest)
        addMessage({
          role: "assistant",
          content: res.answer,
          pdfName: scopeForRequest,
          sources: res.sources ?? [],
        })
      } catch (err) {
        addMessage({
          role: "assistant",
          content: getErrorMessage(err, "No response could be generated. Please try again."),
          pdfName: scopeForRequest,
          isError: true,
        })
      } finally {
        setLoading(false)
      }
    },
    [addMessage, loading, scope],
  )

  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    void handleSubmit(question)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter, but respect IME composition and Shift+Enter for newlines.
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !e.nativeEvent.isComposing &&
      e.keyCode !== 229
    ) {
      e.preventDefault()
      void handleSubmit(question)
    }
  }

  const scopeLabel =
    scope === null ? "all documents" : docs.find((d) => d.pdfName === scope)?.originalName ?? scope

  const hasMessages = messages.length > 0

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] w-full max-w-4xl flex-col px-4 sm:px-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-border py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-accent">
            <MessagesSquare className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-foreground">Document Q&amp;A</h1>
            <p className="truncate text-xs text-muted-foreground">
              Scoped to <span className="font-medium text-foreground">{scopeLabel}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DocSelector docs={docs} value={scope} onChange={setScope} />
          {hasMessages && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearMessages}
              aria-label="Clear conversation"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-6">
        {docs.length === 0 && !hasMessages ? (
          <EmptyNoDocs />
        ) : !hasMessages ? (
          <EmptyWithDocs onPick={(q) => void handleSubmit(q)} />
        ) : (
          <ul className="flex flex-col gap-6">
            {messages.map((m) => (
              <li key={m.id}>
                {m.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
                      {m.content}
                    </div>
                  </div>
                ) : m.isError ? (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
                  >
                    <AlertCircle
                      className="mt-0.5 h-5 w-5 shrink-0 text-destructive"
                      aria-hidden="true"
                    />
                    <p className="text-sm leading-relaxed text-destructive">{m.content}</p>
                  </div>
                ) : (
                  <div className="rounded-2xl rounded-tl-sm border border-border bg-card p-4">
                    <AnswerCard answer={m.content} />
                    <SourcesPanel sources={m.sources ?? []} />
                  </div>
                )}
              </li>
            ))}
            {loading && (
              <li>
                <div className="rounded-2xl rounded-tl-sm border border-border bg-card p-4">
                  <AnswerSkeleton />
                </div>
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-border py-3">
        <form onSubmit={onFormSubmit} className="flex items-end gap-2">
          <div className="flex flex-1 items-end rounded-2xl border border-input bg-card px-3 py-2 focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/20">
            <textarea
              ref={textareaRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              disabled={docs.length === 0 && messages.length === 0 ? false : loading}
              placeholder={
                scope === null
                  ? "Ask a question across all your documents…"
                  : "Ask a question about this document…"
              }
              className="max-h-40 min-h-6 w-full resize-none bg-transparent text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Button
            type="submit"
            size="md"
            disabled={loading || !question.trim()}
            aria-label="Send question"
            className="h-11 w-11 shrink-0 px-0"
          >
            <SendHorizonal className="h-5 w-5" aria-hidden="true" />
          </Button>
        </form>
        <p className="mt-2 px-1 text-center text-xs text-muted-foreground">
          AI-generated and may be inaccurate. This is not legal advice.
        </p>
      </div>
    </div>
  )
}

function EmptyNoDocs() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-accent">
        <FileText className="h-7 w-7" aria-hidden="true" />
      </span>
      <div className="max-w-sm">
        <h2 className="text-lg font-semibold text-foreground">No documents yet</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Upload a legal PDF first, then come back here to ask questions about it.
        </p>
      </div>
      <Button asChild variant="accent">
        <Link to="/upload">
          <Upload className="h-4 w-4" aria-hidden="true" />
          Upload a document
        </Link>
      </Button>
    </div>
  )
}

function EmptyWithDocs({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-accent">
        <Files className="h-7 w-7" aria-hidden="true" />
      </span>
      <div className="max-w-md">
        <h2 className="text-lg font-semibold text-foreground">Ask your first question</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Choose a document above or search across all of them, then ask anything in plain
          language.
        </p>
      </div>
      <div className="grid w-full max-w-lg gap-2 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="rounded-xl border border-border bg-card p-3 text-left text-sm leading-relaxed text-foreground transition-colors hover:border-accent/60 hover:bg-muted/40"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
