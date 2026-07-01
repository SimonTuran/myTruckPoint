"use client"

import { statusTiles } from "@/lib/mock-data"
import { StatusTile } from "@/components/status-tile"

interface StatusStripProps {
  /** When true, flips the first tile to its zero / all-clear state. */
  demoClear: boolean
  onToggleClear: () => void
}

export function StatusStrip({ demoClear, onToggleClear }: StatusStripProps) {
  return (
    <section aria-labelledby="status-heading">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="status-heading" className="text-lg font-semibold text-foreground">
            What needs me today
          </h2>
          <p className="text-sm text-muted-foreground">
            Live status across your fleet. Each tile opens a pre-filtered view.
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleClear}
          aria-pressed={demoClear}
          className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {demoClear ? "Restore demo data" : "Demo: resolve warnings"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statusTiles.map((tile, index) => (
          <StatusTile
            key={tile.id}
            tile={tile}
            count={demoClear && index === 0 ? 0 : undefined}
          />
        ))}
      </div>
    </section>
  )
}
