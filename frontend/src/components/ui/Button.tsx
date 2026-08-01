import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
} from "react"
import { cn } from "@/lib/utils"

type Variant = "primary" | "accent" | "outline" | "ghost"
type Size = "sm" | "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  /** Render the single child element with the button styles applied (e.g. a Link). */
  asChild?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/40",
  accent:
    "bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent/40",
  outline:
    "border border-border bg-card text-foreground hover:bg-muted focus-visible:ring-primary/30",
  ghost: "text-foreground hover:bg-muted focus-visible:ring-primary/30",
}

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-7 text-base gap-2",
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, children, ...props }, ref) => {
    const classes = cn(
      "inline-flex items-center justify-center rounded-[var(--radius)] font-medium transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "disabled:pointer-events-none disabled:opacity-50",
      variantClasses[variant],
      sizeClasses[size],
      className,
    )

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{ className?: string }>
      return cloneElement(child, {
        className: cn(classes, child.props.className),
      })
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    )
  },
)
Button.displayName = "Button"
