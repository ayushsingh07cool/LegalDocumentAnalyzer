import {
  AlertTriangle,
  BookOpen,
  FileText,
  Info,
  Lightbulb,
  ShieldAlert,
  Sparkles,
} from "lucide-react"
import { parseAnswer, type AnswerSection } from "@/lib/parseAnswer"
import CopyButton from "./CopyButton"
import { cn } from "@/lib/utils"

type Tone = "primary" | "neutral" | "risk" | "disclaimer"

const sectionMeta: Record<
  string,
  { icon: typeof Info; tone: Tone }
> = {
  answer: { icon: Sparkles, tone: "primary" },
  clause: { icon: BookOpen, tone: "neutral" },
  supporting: { icon: FileText, tone: "neutral" },
  explanation: { icon: Lightbulb, tone: "neutral" },
  risks: { icon: AlertTriangle, tone: "risk" },
  disclaimer: { icon: ShieldAlert, tone: "disclaimer" },
}

const toneClasses: Record<Tone, { wrap: string; icon: string; title: string }> = {
  primary: {
    wrap: "border-accent/30 bg-accent/5",
    icon: "bg-accent text-accent-foreground",
    title: "text-foreground",
  },
  neutral: {
    wrap: "border-border bg-background",
    icon: "bg-muted text-accent",
    title: "text-foreground",
  },
  risk: {
    wrap: "border-warning/30 bg-warning/5",
    icon: "bg-warning text-warning-foreground",
    title: "text-warning",
  },
  disclaimer: {
    wrap: "border-border bg-muted/50",
    icon: "bg-muted text-muted-foreground",
    title: "text-muted-foreground",
  },
}

function SectionBlock({ section }: { section: AnswerSection }) {
  const meta = sectionMeta[section.key] ?? { icon: Info, tone: "neutral" as Tone }
  const tone = toneClasses[meta.tone]
  const Icon = meta.icon

  return (
    <div className={cn("rounded-lg border p-4", tone.wrap)}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={cn("flex h-7 w-7 items-center justify-center rounded-md", tone.icon)}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <h4 className={cn("text-sm font-semibold", tone.title)}>{section.title}</h4>
        </div>
        <CopyButton text={section.content} label="" className="px-1.5" />
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
        {section.content}
      </p>
    </div>
  )
}

export default function AnswerCard({ answer }: { answer: string }) {
  const sections = parseAnswer(answer)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Legal analysis
        </span>
        <CopyButton text={answer} label="Copy all" />
      </div>
      {sections.map((section) => (
        <SectionBlock key={section.key} section={section} />
      ))}
    </div>
  )
}
