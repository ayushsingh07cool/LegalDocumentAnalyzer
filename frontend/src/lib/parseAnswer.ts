export interface AnswerSection {
  key: string
  title: string
  content: string
}

/** Canonical section headings the backend produces, in display order. */
const KNOWN_SECTIONS: { key: string; title: string; matchers: string[] }[] = [
  { key: "answer", title: "Answer", matchers: ["answer"] },
  {
    key: "clause",
    title: "Relevant Clause / Section",
    matchers: ["relevant clause/section", "relevant clause / section", "relevant clause", "relevant section"],
  },
  { key: "supporting", title: "Supporting Text", matchers: ["supporting text"] },
  { key: "explanation", title: "Explanation", matchers: ["explanation"] },
  {
    key: "risks",
    title: "Potential Risks / Important Notes",
    matchers: ["potential risks / important notes", "potential risks/important notes", "potential risks", "important notes"],
  },
  { key: "disclaimer", title: "Disclaimer", matchers: ["disclaimer"] },
]

function normalize(label: string): string {
  return label
    .toLowerCase()
    .replace(/[*:_#]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Parse the structured "markdown-ish" answer into labelled sections.
 * The backend emits headings like `**Answer:**`, `**Relevant Clause/Section:**`, etc.
 * Any content that doesn't match a known heading is returned as an "Answer"
 * fallback so nothing is ever dropped.
 */
export function parseAnswer(raw: string): AnswerSection[] {
  if (!raw?.trim()) return []

  // Split on bold headings that end with a colon, e.g. **Answer:**
  const headingRegex = /\*\*\s*([^*]+?)\s*:?\s*\*\*\s*:?/g

  const matches: { label: string; index: number; length: number }[] = []
  let m: RegExpExecArray | null
  while ((m = headingRegex.exec(raw)) !== null) {
    matches.push({ label: m[1], index: m.index, length: m[0].length })
  }

  if (matches.length === 0) {
    return [{ key: "answer", title: "Answer", content: raw.trim() }]
  }

  const sections: AnswerSection[] = []

  // Any text before the first heading -> treat as answer prose.
  const preamble = raw.slice(0, matches[0].index).trim()
  if (preamble) {
    sections.push({ key: "answer", title: "Answer", content: preamble })
  }

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i]
    const next = matches[i + 1]
    const contentStart = current.index + current.length
    const contentEnd = next ? next.index : raw.length
    const content = raw.slice(contentStart, contentEnd).trim()

    const normLabel = normalize(current.label)
    const known = KNOWN_SECTIONS.find((s) => s.matchers.some((mm) => normLabel === mm || normLabel.startsWith(mm)))

    sections.push({
      key: known?.key ?? `custom-${i}`,
      title: known?.title ?? current.label.trim(),
      content,
    })
  }

  // Preserve canonical ordering where possible, then append any extras.
  const order = KNOWN_SECTIONS.map((s) => s.key)
  return sections.sort((a, b) => {
    const ai = order.indexOf(a.key)
    const bi = order.indexOf(b.key)
    if (ai === -1 && bi === -1) return 0
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })
}
