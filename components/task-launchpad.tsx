"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { taskTiles } from "@/lib/mock-data"

export function TaskLaunchpad() {
  return (
    <section aria-labelledby="tasks-heading">
      <h2 id="tasks-heading" className="mb-1 text-lg font-semibold text-foreground">
        Get things done
      </h2>
      <p className="mb-3 text-sm text-muted-foreground">
        Jump straight into your most frequent jobs.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {taskTiles.map((task) => {
          const Icon = task.icon
          const href = `/stub?${new URLSearchParams({
            label: task.destinationLabel,
            group: task.title,
          }).toString()}`
          return (
            <Link
              key={task.id}
              href={href}
              onClick={() =>
                console.log(`[v0] TaskTile → ${task.destinationLabel} | href=${href}`)
              }
              className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-card-foreground">{task.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground text-pretty">
                  {task.subtitle}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                Open
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
