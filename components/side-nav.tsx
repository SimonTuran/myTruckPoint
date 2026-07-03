"use client"

import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { navGroups } from "@/lib/mock-data"
import { statusStyles } from "@/lib/status-styles"

interface SideNavProps {
  /** Icon-only collapsed rail (desktop). */
  onOpenDrawer: () => void
  onToggleRail: () => void
  railCollapsed: boolean
  collapsed: boolean
  activeGroupId: string
  activeItemId: string | null
  /** Called after a navigation (used to close the mobile drawer). */
  onNavigate?: () => void
  /** Ask the shell to expand the collapsed rail. */
  onExpandRequest?: () => void
}

export function SideNav({
  onOpenDrawer,
  onToggleRail,
  railCollapsed,
  collapsed,
  activeGroupId,
  activeItemId,
  onNavigate,
  onExpandRequest,
}: SideNavProps) {
  const [openGroups, setOpenGroups] = useState<string[]>([activeGroupId])

  // Keep the active group expanded as the route changes.
  useEffect(() => {
    setOpenGroups((prev) => (prev.includes(activeGroupId) ? prev : [...prev, activeGroupId]))
  }, [activeGroupId])

  function toggleGroup(id: string) {
    setOpenGroups((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]))
  }

  return (
    <nav aria-label="Primary" className="flex h-full flex-col gap-4 p-2">
  {navGroups.map((group) => {
    const Icon = group.icon
    const isActiveGroup = activeGroupId === group.id
    const isOpen = openGroups.includes(group.id)
    const hasItems = group.items.length > 0
    const badge = group.badge

    // --- Collapsed rail: icon-only ---
    if (collapsed) {
      const content = (
        <span className="relative inline-flex">
          <Icon className="size-5" aria-hidden="true" />
          {badge && (
            <span
              className={cn(
                "absolute -right-2 -top-2 inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-4",
                statusStyles[badge.status].badge,
              )}
            >
              {badge.count}
            </span>
          )}
        </span>
      )
      const common =
        "relative flex items-center justify-center rounded-md p-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      return group.href ? (
        <Link
          key={group.id}
          href={group.href}
          title={group.label}
          aria-label={group.label}
          aria-current={isActiveGroup ? "page" : undefined}
          onClick={onNavigate}
          className={cn(
            common,
            isActiveGroup
              ? "bg-primary text-primary-foreground"
              : "text-secondary-foreground hover:bg-secondary",
          )}
        >
          {content}
        </Link>
      ) : (
        <button
          key={group.id}
          type="button"
          title={group.label}
          aria-label={`${group.label}, expand navigation`}
          onClick={onExpandRequest}
          className={cn(
            common,
            isActiveGroup
              ? "bg-primary text-primary-foreground"
              : "text-secondary-foreground hover:bg-secondary",
          )}
        >
          {content}
        </button>
      )
    }

    // --- Expanded rail / drawer ---
    if (!hasItems && group.href) {
      return (
        <Link
          key={group.id}
          href={group.href}
          aria-current={isActiveGroup ? "page" : undefined}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            isActiveGroup
              ? "bg-primary text-primary-foreground"
              : "text-secondary-foreground hover:bg-secondary",
          )}
        >
          <Icon className="size-5 shrink-0" aria-hidden="true" />
          {group.label}
        </Link>
      )
    }

    const groupActiveButNoItem = isActiveGroup && !activeItemId

    return (
      <div key={group.id}>
        <button
          type="button"
          onClick={() => toggleGroup(group.id)}
          aria-expanded={isOpen}
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            groupActiveButNoItem
              ? "bg-primary text-accent-foreground"
              : "text-secondary-foreground hover:bg-secondary",
          )}
        >
          <Icon className="size-5 shrink-0" aria-hidden="true" />
          <span className="flex-1 text-left">{group.label}</span>
          {badge && (
            <span
              className={cn(
                "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-bold leading-none",
                statusStyles[badge.status].badge,
              )}
              aria-label={`${badge.count} need attention`}
            >
              {badge.count}
            </span>
          )}
          <ChevronDown
            className={cn("size-4 shrink-0 transition-transform", isOpen && "rotate-180")}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <ul className="mb-1 ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-border pl-3">
            {group.items.map((item) => {
              const isActiveItem = activeItemId === item.id
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    aria-current={isActiveItem ? "page" : undefined}
                    onClick={onNavigate}
                    className={cn(
                      "block rounded-md px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      isActiveItem
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    )
  })}

  {/* Fester Fußbereich, rechtsbündig, ans Ende gedrückt */}
  <div className="mt-auto mr-2 flex justify-end pt-2">
    <button
      type="button"
      onClick={onToggleRail}
      className="mt-auto hidden size-9 items-center justify-center rounded-md text-secondary-foreground hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:inline-flex"
      aria-label={railCollapsed ? "Expand navigation rail" : "Collapse navigation rail"}
      aria-pressed={railCollapsed}
    >
      {railCollapsed ? (
        <PanelLeftOpen className="size-5" aria-hidden="true" />
      ) : (
        <PanelLeftClose className="size-5" aria-hidden="true" />
      )}
    </button>
  </div>
</nav>
  )
}
