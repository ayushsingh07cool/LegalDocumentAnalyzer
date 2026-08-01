import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  MessageSquareText,
  Trash2,
  X,
} from "lucide-react"
import DropZone from "@/components/DropZone"
import { Button } from "@/components/ui/Button"
import { getErrorMessage, uploadPdf } from "@/lib/api"
import { useAppStore } from "@/store/AppStore"
import { cn, formatBytes } from "@/lib/utils"

const MAX_SIZE = 20 * 1024 * 1024 // 20MB

type Status = "idle" | "uploading" | "success" | "error"

export default function UploadPage() {
  const navigate = useNavigate()
  const { docs, addDoc, removeDoc } = useAppStore()

  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [lastUploaded, setLastUploaded] = useState<string | null>(null)

  const validate = useCallback((f: File): string | null => {
    const isPdf =
      f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    if (!isPdf) return "That file isn't a PDF. Please choose a .pdf document."
    if (f.size > MAX_SIZE) return `File is too large (${formatBytes(f.size)}). Max size is 20 MB.`
    if (f.size === 0) return "That file appears to be empty."
    return null
  }, [])

  const handleFileSelected = useCallback(
    (f: File) => {
      setError(null)
      setStatus("idle")
      setProgress(0)
      setLastUploaded(null)
      const validationError = validate(f)
      if (validationError) {
        setFile(null)
        setStatus("error")
        setError(validationError)
        return
      }
      setFile(f)
    },
    [validate],
  )

  const handleUpload = useCallback(async () => {
    if (!file) return
    setStatus("uploading")
    setProgress(0)
    setError(null)
    try {
      const result = await uploadPdf(file, setProgress)
      addDoc({
        pdfName: result.pdfName,
        originalName: file.name,
        size: file.size,
        uploadedAt: Date.now(),
      })
      setStatus("success")
      setLastUploaded(result.pdfName)
      setFile(null)
    } catch (err) {
      setStatus("error")
      setError(getErrorMessage(err, "Upload failed. Please try again."))
    }
  }, [file, addDoc])

  const resetSelection = useCallback(() => {
    setFile(null)
    setStatus("idle")
    setProgress(0)
    setError(null)
  }, [])

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Upload a document
        </h1>
        <p className="text-pretty leading-relaxed text-muted-foreground">
          Add a legal PDF to analyze. Once processed, you can ask questions about it on the
          chat page.
        </p>
      </div>

      {/* Upload area */}
      <div className="mt-8">
        {!file && status !== "uploading" && (
          <DropZone
            onFileSelected={handleFileSelected}
            maxSizeBytes={MAX_SIZE}
          />
        )}

        {file && status !== "uploading" && (
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted text-accent">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">{formatBytes(file.size)}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button onClick={handleUpload}>Upload</Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetSelection}
                aria-label="Remove selected file"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}

        {status === "uploading" && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-accent" aria-hidden="true" />
              <p className="font-medium text-foreground">Uploading & processing…</p>
            </div>
            <div className="mt-4">
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-right text-sm text-muted-foreground">{progress}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Feedback */}
      {status === "error" && error && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-destructive">{error}</p>
        </div>
      )}

      {status === "success" && lastUploaded && (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-accent/30 bg-accent/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-foreground">
              <span className="font-medium">Uploaded successfully.</span> You can now ask
              questions about this document.
            </p>
          </div>
          <Button
            size="sm"
            variant="accent"
            className="shrink-0"
            onClick={() => navigate(`/chat?pdf=${encodeURIComponent(lastUploaded)}`)}
          >
            <MessageSquareText className="h-4 w-4" aria-hidden="true" />
            Start chat
          </Button>
        </div>
      )}

      {/* Uploaded documents */}
      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Your documents</h2>
          {docs.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => navigate("/chat")}>
              Go to chat
            </Button>
          )}
        </div>

        {docs.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No documents yet. Upload a PDF above to get started.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {docs.map((doc) => (
              <li
                key={doc.pdfName}
                className={cn(
                  "flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4",
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-accent">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{doc.originalName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(doc.size)} ·{" "}
                      {new Date(doc.uploadedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/chat?pdf=${encodeURIComponent(doc.pdfName)}`)}
                  >
                    Chat
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeDoc(doc.pdfName)}
                    aria-label={`Remove ${doc.originalName} from your list`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          Documents are tracked in your browser only. Removing one here won&apos;t delete it
          from the backend.
        </p>
      </section>
    </div>
  )
}
