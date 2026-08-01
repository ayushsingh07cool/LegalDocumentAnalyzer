import { useEffect, useRef, useState } from "react"
import { Check, ChevronsUpDown, FileText, Files } from "lucide-react"
import type { UploadedDoc } from "@/store/AppStore"
import { cn } from "@/lib/utils"

interface DocSelectorProps {
  docs: UploadedDoc[]
  /** null = all documents */
  value: string | null
  onChange: (pdfName: string | null) => void
}

const ALL = "__all__"

export default function DocSelector({ docs, value, onChange }: DocSelectorProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [open])

  const selected = value ? docs.find((d) => d.pdfName === value) : null
  const label = value === null ? "All documents" : selected?.originalName ?? value

  const select = (v: string | null) => {
    onChange(v)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted/60 sm:w-64"
      >
        <span className="flex min-w-0 items-center gap-2">
          {value === null ? (
            <Files className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          ) : (
            <FileText className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          )}
          <span className="truncate">{label}</span>
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-20 mt-1 max-h-72 w-full min-w-64 overflow-auto rounded-lg border border-border bg-card p-1 shadow-lg sm:w-72"
        >
          <li>
            <button
              type="button"
              role="option"
              aria-selected={value === null}
              onClick={() => select(null)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted",
                value === null && "bg-muted",
              )}
            >
              <Files className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span className="flex-1 truncate">All documents</span>
              {value === null && <Check className="h-4 w-4 text-accent" aria-hidden="true" />}
            </button>
          </li>

          {docs.length > 0 && <li className="my-1 border-t border-border" aria-hidden="true" />}

          {docs.map((doc) => (
            <li key={doc.pdfName}>
              <button
                type="button"
                role="option"
                aria-selected={value === doc.pdfName}
                onClick={() => select(doc.pdfName)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted",
                  value === doc.pdfName && "bg-muted",
                )}
                title={doc.originalName}
              >
                <FileText className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <span className="flex-1 truncate">{doc.originalName}</span>
                {value === doc.pdfName && (
                  <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export { ALL }
