"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ContextPanel } from "@/components/context-panel"
import { StatusStrip } from "@/components/status-strip"
import { TaskLaunchpad } from "@/components/task-launchpad"
import { BeforeView } from "@/components/before-view"

export function DashboardView() {
  const [demoClear, setDemoClear] = useState(false)
  const [showBefore, setShowBefore] = useState(false)

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:py-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Fleet dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            {showBefore
              ? "Before — the brochure-style entrypoint we are replacing."
              : "Good morning, Kari. Here is your fleet at a glance."}
          </p>
        </div>

        {/* Before / After toggle */}
        <div
          className="inline-flex items-center rounded-md border border-border bg-card p-0.5 text-sm"
          role="group"
          aria-label="Toggle between before and after dashboard"
        >
          <button
            type="button"
            onClick={() => setShowBefore(true)}
            aria-pressed={showBefore}
            className={cn(
              "rounded-[5px] px-3 py-1.5 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              showBefore
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Before
          </button>
          <button
            type="button"
            onClick={() => setShowBefore(false)}
            aria-pressed={!showBefore}
            className={cn(
              "rounded-[5px] px-3 py-1.5 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              !showBefore
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            After
          </button>
        </div>
      </div>

      {showBefore ? (
        <BeforeView />
      ) : (
        <div className="space-y-8">
          {/* Zone A — loudest */}
          <StatusStrip demoClear={demoClear} onToggleClear={() => setDemoClear((c) => !c)} />
          {/* Zone B */}
          <TaskLaunchpad />
          {/* Zone C — quietest */}
          <ContextPanel />
        </div>
      )}
    </div>
  )
}
