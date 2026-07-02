"use client"

import { Bell, HelpCircle, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { BrandStar } from "@/components/brand-star"
import { portal } from "@/lib/mock-data"

interface TopBarProps {
  onOpenDrawer: () => void
}

export function TopBar({ onOpenDrawer }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-25 items-center gap-3 bg-header px-3 text-header-foreground sm:px-4">
      {/* Mobile: open drawer. Desktop: collapse/expand rail. */}
      <button
        type="button"
        onClick={onOpenDrawer}
        className="inline-flex size-9 items-center justify-center rounded-md text-header-foreground hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <BrandStar className="size-25 text-header-foreground" />
        <div className="flex flex-col leading-tight">
          <span className="mercedesFontBig font-brand tracking-wide">Mercedes-Benz</span>
          <span className="mercedesFontMedium font-semibold uppercase tracking-wider text-header-muted">
            Trucks you can trust
          </span>
        </div>
      </div>

      {/* Portal name — hidden on the smallest screens */}
      <span className="text-[20px] ml-1 hidden truncate border-l border-white/15 pl-3 text-sm font-semibold tracking-wide md:inline">
        {portal.brand}
      </span>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {/* Company name — visible before the icons */}
        <span className="text-[17px] hidden border-r border-white/15 pr-5 text-sm font-semibold sm:inline">
          {portal.company}
        </span>

        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-md hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Help"
        >
          <HelpCircle className="size-6" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="relative inline-flex size-9 items-center justify-center rounded-md hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label={`Notifications, ${portal.notifications} unread`}
        >
          <Bell className="size-6" aria-hidden="true" />
          <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-4 items-center justify-center rounded-full bg-critical px-1 text-[10px] font-bold leading-4 text-critical-foreground">
            {portal.notifications}
          </span>
        </button>

        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-md hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label={`Account: ${portal.user.name}`}
        >
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-white/15 text-xs font-semibold" aria-hidden="true">
            {portal.user.initials}
          </span>
        </button>
      </div>
    </header>
  )
}