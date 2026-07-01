"use client"

import Link from "next/link"
import { ArrowUpRight, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { StatusTileData } from "@/lib/mock-data"
import { statusStyles, statusWord } from "@/lib/status-styles"

interface StatusTileProps {
  tile: StatusTileData
  /** Optional override (used to demo the zero / all-clear state). */
  count?: number
}

export function StatusTile({ tile, count }: StatusTileProps) {
  const effectiveCount = count ?? tile.count
  const isClear = effectiveCount === 0
  const status = isClear ? "ok" : tile.status
  const styles = statusStyles[status]
  const Icon = isClear ? CheckCircle2 : tile.icon
  const word = statusWord[status]
  const context = isClear ? tile.clearContext : tile.context

  const href = `/stub?${new URLSearchParams({
    label: tile.destinationLabel,
    group: tile.group,
    filter: isClear ? "" : tile.filter,
  }).toString()}`

  const accessibleName = isClear
    ? `${tile.label}: all clear, ${context}. View ${tile.destinationLabel}.`
    : `${tile.label}: ${effectiveCount}, ${word}, ${context}. View ${tile.destinationLabel} filtered by ${tile.filter}.`

  return (
    <Link
      href={href}
      aria-label={accessibleName}
      onClick={() =>
        console.log(
          `[v0] StatusTile → ${tile.destinationLabel}${isClear ? "" : ` (filter: ${tile.filter})`} | href=${href}`,
        )
      }
      className={cn(
        "group flex flex-col gap-3 rounded-lg border border-l-4 border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        styles.border,
        styles.tint,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-md",
            styles.solid,
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            styles.pill,
          )}
        >
          {word}
        </span>
      </div>

      <div>
        <div className="flex items-baseline gap-1.5">
          <span className={cn("text-3xl font-bold tabular-nums leading-none", styles.text)}>
            {effectiveCount}
          </span>
          {isClear && (
            <span className="text-sm font-medium text-muted-foreground">— nothing due</span>
          )}
        </div>
        <h3 className="mt-1.5 text-sm font-semibold text-card-foreground text-pretty">
          {tile.label}
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground text-pretty">{context}</p>
      </div>

      <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-primary">
        {isClear ? "View" : "View filtered"}
        <ArrowUpRight
          className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </span>
    </Link>
  )
}
