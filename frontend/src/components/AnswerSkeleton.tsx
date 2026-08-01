export default function AnswerSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-live="polite" aria-busy="true">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Analyzing document…
      </span>
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-lg border border-border bg-background p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-7 w-7 animate-pulse rounded-md bg-muted" />
            <div className="h-3.5 w-32 animate-pulse rounded bg-muted" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-3 w-full animate-pulse rounded bg-muted" />
            <div className="h-3 w-11/12 animate-pulse rounded bg-muted" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
      <span className="sr-only">Waiting for the AI response</span>
    </div>
  )
}
