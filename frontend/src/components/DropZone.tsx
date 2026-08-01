import { useCallback, useRef, useState, type DragEvent } from "react"
import { UploadCloud } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropZoneProps {
  onFileSelected: (file: File) => void
  disabled?: boolean
  maxSizeBytes: number
}

export default function DropZone({ onFileSelected, disabled, maxSizeBytes }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return
      onFileSelected(files[0])
    },
    [onFileSelected],
  )

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled) return
      handleFiles(e.dataTransfer.files)
    },
    [disabled, handleFiles],
  )

  const maxMb = Math.round(maxSizeBytes / (1024 * 1024))

  return (
    <div
      role="button"
      tabIndex={0}
      aria-disabled={disabled}
      aria-label="Upload a PDF by dragging it here or activating to browse"
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled) {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isDragging
          ? "border-accent bg-accent/5"
          : "border-border bg-card hover:border-accent/60 hover:bg-muted/40",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <span
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
          isDragging ? "bg-accent text-accent-foreground" : "bg-muted text-accent",
        )}
      >
        <UploadCloud className="h-7 w-7" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-base font-medium text-foreground">
          {isDragging ? "Drop your PDF to upload" : "Drag & drop your PDF here"}
        </p>
        <p className="text-sm text-muted-foreground">
          or <span className="font-medium text-accent">browse your files</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">PDF only · up to {maxMb} MB</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          handleFiles(e.target.files)
          // reset so selecting the same file again re-triggers change
          e.target.value = ""
        }}
      />
    </div>
  )
}
