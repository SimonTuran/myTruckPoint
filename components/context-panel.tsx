import { CheckCircle2, ChevronRight, LifeBuoy } from "lucide-react"
import { account, helpInfo, servicesInfo } from "@/lib/mock-data"

export function ContextPanel() {
  return (
    <section aria-labelledby="context-heading">
      <h2 id="context-heading" className="mb-3 text-sm font-semibold text-muted-foreground">
        Account &amp; resources
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {/* Account summary */}
      <div className="rounded-lg border border-border bg-card/60 p-4">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex size-10 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground"
            aria-hidden="true"
          >
            {account.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-card-foreground">{account.name}</p>
            <p className="truncate text-xs text-muted-foreground">{account.company}</p>
          </div>
        </div>

        {account.dataProcessing && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-ok/10 px-2 py-1 text-xs font-medium text-ok">
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            Data processing agreed
          </p>
        )}

        <a
          href="#"
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          My account
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </a>
      </div>

      {/* Services info */}
      <div className="rounded-lg border border-border bg-card/60 p-4">
        <h3 className="text-sm font-semibold text-card-foreground">{servicesInfo.title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground text-pretty">
          {servicesInfo.body}
        </p>
        <a
          href="#"
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {servicesInfo.linkLabel}
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </a>
      </div>

      {/* Help & contact */}
      <a
        href="#"
        className="flex items-center gap-3 rounded-lg border border-border bg-card/60 p-4 transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <span className="inline-flex size-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
          <LifeBuoy className="size-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-card-foreground">
            {helpInfo.title}
          </span>
          <span className="block text-xs text-muted-foreground text-pretty">{helpInfo.body}</span>
        </span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </a>
      </div>
    </section>
  )
}
