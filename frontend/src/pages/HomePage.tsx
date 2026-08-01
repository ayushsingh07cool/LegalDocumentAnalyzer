import { Link } from "react-router-dom"
import { ArrowRight, FileSearch, MessageSquareText, ShieldCheck, Quote } from "lucide-react"
import { Button } from "@/components/ui/Button"

const features = [
  {
    icon: FileSearch,
    title: "Grounded retrieval",
    body: "Your PDF is split into passages and embedded, so answers are pulled from the actual text of your document — not the model's imagination.",
  },
  {
    icon: MessageSquareText,
    title: "Structured legal answers",
    body: "Every response is organized into the answer, the relevant clause, supporting text, plain-English explanation, and potential risks.",
  },
  {
    icon: ShieldCheck,
    title: "Verifiable sources",
    body: "Each answer ships with the exact source chunks and similarity scores it was built from, so you can check the work yourself.",
  },
]

const steps = [
  { n: "01", title: "Upload a PDF", body: "Drop in a contract, lease, policy, or filing." },
  { n: "02", title: "Ask a question", body: "Use plain language — no legal jargon required." },
  { n: "03", title: "Read the analysis", body: "Get a grounded answer with citations and risk notes." },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            AI-powered legal document analysis
          </span>
          <h1 className="text-pretty font-serif text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            Understand any legal document in plain language
          </h1>
          <p className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
            Upload a legal PDF and ask natural-language questions. LegalAnalyzer finds the
            relevant clauses and returns a grounded, cited answer — so you know exactly where
            every conclusion comes from.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link to="/upload">
                Upload a document
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/chat">Try the chat</Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <img
              src="/hero-documents.png"
              alt="Illustration of legal documents being analyzed with highlighted clauses connected to AI insight cards"
              className="h-full w-full object-cover"
              width={720}
              height={560}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance font-serif text-3xl font-bold tracking-tight text-foreground">
              Built for trust, not guesswork
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              Legal work demands accuracy. LawAajKal is designed so you can verify every
              answer against the source material.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex flex-col gap-3 rounded-xl border border-border bg-background p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted text-accent">
                  <f.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-balance font-serif text-3xl font-bold tracking-tight text-foreground">
          How it works
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6">
              <span className="font-serif text-2xl font-bold text-accent">{s.n}</span>
              <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button asChild size="lg">
            <Link to="/upload">
              Get started
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Disclaimer callout */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto flex w-full max-w-3xl items-start gap-3 px-4 py-12 sm:px-6">
          <Quote className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            LegalAnalyzer is a research assistant, not a substitute for professional counsel.
            Answers are AI-generated from your uploaded documents and may contain errors or
            omissions. Always confirm important matters with a qualified attorney.
          </p>
        </div>
      </section>
    </div>
  )
}
