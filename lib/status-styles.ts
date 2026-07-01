import type { StatusLevel } from "./mock-data"

/** Text label paired with colour so status is never colour-only. */
export const statusWord: Record<StatusLevel, string> = {
  critical: "Action needed",
  warning: "Upcoming",
  ok: "All clear",
  info: "In progress",
}

interface StatusClasses {
  /** Solid accent bar / icon chip background. */
  solid: string
  /** Soft tinted surface for the tile when active. */
  tint: string
  /** Strong text colour for the count. */
  text: string
  /** Left accent border colour. */
  border: string
  /** Badge background + text (nav count badges). */
  badge: string
  /** Status word pill. */
  pill: string
}

export const statusStyles: Record<StatusLevel, StatusClasses> = {
  critical: {
    solid: "bg-critical text-critical-foreground",
    tint: "bg-critical/8",
    text: "text-critical",
    border: "border-l-critical",
    badge: "bg-critical text-critical-foreground",
    pill: "bg-critical/12 text-critical",
  },
  warning: {
    solid: "bg-warning text-warning-foreground",
    tint: "bg-warning/12",
    text: "text-warning-foreground",
    border: "border-l-warning",
    badge: "bg-warning text-warning-foreground",
    pill: "bg-warning/20 text-warning-foreground",
  },
  ok: {
    solid: "bg-ok text-ok-foreground",
    tint: "bg-ok/8",
    text: "text-ok",
    border: "border-l-ok",
    badge: "bg-ok text-ok-foreground",
    pill: "bg-ok/12 text-ok",
  },
  info: {
    solid: "bg-info text-info-foreground",
    tint: "bg-info/8",
    text: "text-info",
    border: "border-l-info",
    badge: "bg-info text-info-foreground",
    pill: "bg-info/12 text-info",
  },
}
