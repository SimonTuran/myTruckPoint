import Link from "next/link"
import { ArrowLeft, Filter } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { itemIcons, resolveNav } from "@/lib/mock-data"

export default async function StubPage({
  searchParams,
}: {
  searchParams: Promise<{ label?: string; group?: string; filter?: string }>
}) {
  const { label = "Destination", group = "", filter = "" } = await searchParams
  const { groupId, itemId } = resolveNav(label)
  const Icon = (itemId && itemIcons[itemId]) || Filter

  return (
    <AppShell activeGroupId={groupId || "dashboard"} activeItemId={itemId}>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to dashboard
        </Link>

        <div className="rounded-xl border border-border bg-card p-8">
          <span className="inline-flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-6" aria-hidden="true" />
          </span>

          {group && (
            <p className="mt-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {group}
            </p>
          )}
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground text-balance">
            {label}
          </h1>

          {filter ? (
            <p className="mt-3 inline-flex items-center gap-2 rounded-md bg-warning/15 px-3 py-1.5 text-sm font-medium text-warning-foreground">
              <Filter className="size-4" aria-hidden="true" />
              Pre-filtered: {filter}
            </p>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No filter applied.</p>
          )}

          <p className="mt-6 max-w-prose text-sm leading-relaxed text-muted-foreground text-pretty">
            This is a stub destination for the concept prototype. In the real portal this is where
            you would land — already scoped to exactly what the dashboard tile promised, so the
            fleet manager reaches the relevant view in a single click.
          </p>
        </div>
      </div>
    </AppShell>
  )
}
