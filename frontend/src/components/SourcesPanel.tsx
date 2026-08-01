import { useState } from "react"
import { ChevronDown, FileText } from "lucide-react"
import type { Source } from "@/lib/api"
import { cn } from "@/lib/utils"

function scoreColor(score: number): string {
  if (score >= 0.8) return "bg-accent/15 text-accent"
  if (score >= 0.65) return "bg-warning/15 text-warning"
  return "bg-muted text-muted-foreground"
}

export default function SourcesPanel({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState(false)

  if (!sources || sources.length === 0) return null

  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-border bg-background">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
      >
        <span className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          View sources
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            {sources.length}
          </span>
        </span>
        <ChevronDown
          className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul className="flex flex-col gap-3 border-t border-border p-4">
          {sources.map((source, i) => (
            <li key={i} className="rounded-lg border border-border bg-card p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Source {i + 1}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
                    scoreColor(source.score),
                  )}
                  title="Similarity score"
                >
                  {(source.score * 100).toFixed(0)}% match
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {source.text}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
