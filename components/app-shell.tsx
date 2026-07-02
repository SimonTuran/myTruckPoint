"use client"

import { X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { SideNav } from "@/components/side-nav"
import { TopBar } from "@/components/top-bar"
import { Footer } from "./footer"

interface AppShellProps {
  activeGroupId: string
  activeItemId?: string | null
  children: React.ReactNode
}

export function AppShell({ activeGroupId, activeItemId = null, children }: AppShellProps) {
  const [railCollapsed, setRailCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex min-h-dvh flex-col bg-background">
  <TopBar
    onOpenDrawer={() => setDrawerOpen(true)}
  />

  <div
    className="flex flex-1 flex-col"
    style={{ "--sidebar-width": railCollapsed ? "4rem" : "16rem" } as React.CSSProperties}
  >
    <div className="flex flex-1">
      {/* Desktop persistent rail */}
      <aside
        className={cn(
          "fixed top-25 hidden h-[calc(100dvh-6.25rem)] shrink-0 bg-header transition-[width] duration-200 lg:block",
          railCollapsed ? "w-16" : "w-64",
        )}
      >
        <SideNav
          onOpenDrawer={() => setDrawerOpen(true)}
          onToggleRail={() => setRailCollapsed((c) => !c)}
          railCollapsed={railCollapsed}
          collapsed={railCollapsed}
          activeGroupId={activeGroupId}
          activeItemId={activeItemId}
          onExpandRequest={() => setRailCollapsed(false)}
        />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-72 max-w-[85%] flex-col bg-card shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <span className="text-sm font-semibold">Menu</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation menu"
                className="inline-flex size-9 items-center justify-center rounded-md hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SideNav
                onOpenDrawer={() => setDrawerOpen(true)}
                onToggleRail={() => setRailCollapsed((c) => !c)}
                railCollapsed={railCollapsed}
                collapsed={false}
                activeGroupId={activeGroupId}
                activeItemId={activeItemId}
                onNavigate={() => setDrawerOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      <main
        className="min-w-0 flex-1 transition-[margin] duration-200 lg:ml-[var(--sidebar-width)]"
      >
        {children}
      </main>
    </div>
    <Footer />
  </div>
</div>
  )
}
