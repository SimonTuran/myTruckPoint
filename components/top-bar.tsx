"use client"

import { Bell, BotMessageSquare, HelpCircle, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { BrandStar } from "@/components/brand-star"
import { portal } from "@/lib/mock-data"

interface TopBarProps {
    onOpenDrawer: () => void
    onToggleRail: () => void
    railCollapsed: boolean
    onOpenChat?: () => void
}

export function TopBar({ onOpenDrawer, onToggleRail, railCollapsed, onOpenChat }: TopBarProps) {
    return (
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 bg-header px-3 text-header-foreground sm:px-4">
            {/* Mobile: open drawer. Desktop: collapse/expand rail. */}
            <button
                type="button"
                onClick={onOpenDrawer}
                className="inline-flex size-9 items-center justify-center rounded-md text-header-foreground hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:hidden"
                aria-label="Open navigation menu"
            >
                <Menu className="size-5" aria-hidden="true" />
            </button>
            <button
                type="button"
                onClick={onToggleRail}
                className="hidden size-9 items-center justify-center rounded-md text-header-foreground hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:inline-flex"
                aria-label={railCollapsed ? "Expand navigation rail" : "Collapse navigation rail"}
                aria-pressed={railCollapsed}
            >
                {railCollapsed ? (
                    <PanelLeftOpen className="size-5" aria-hidden="true" />
                ) : (
                    <PanelLeftClose className="size-5" aria-hidden="true" />
                )}
            </button>

            {/* Brand */}
            <div className="flex items-center gap-2.5">
                <BrandStar className="size-7 text-header-foreground" />
                <span className="text-sm font-semibold tracking-[0.18em]">{portal.brand}</span>
            </div>

            {/* Company name — hidden on the smallest screens */}
            <span className="ml-1 hidden truncate border-l border-white/15 pl-3 text-sm text-header-muted md:inline">
        {portal.company}
      </span>

            <div className="ml-auto flex items-center gap-1 sm:gap-2">
                {/* AI Chatbot */}
                <button
                    type="button"
                    onClick={onOpenChat}
                    className="inline-flex size-9 items-center justify-center rounded-md hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    aria-label="KI-Assistent öffnen"
                >
                    <BotMessageSquare className="size-5" aria-hidden="true" />
                </button>

                <button
                    type="button"
                    className="inline-flex size-9 items-center justify-center rounded-md hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    aria-label="Help"
                >
                    <HelpCircle className="size-5" aria-hidden="true" />
                </button>

                <button
                    type="button"
                    className="relative inline-flex size-9 items-center justify-center rounded-md hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    aria-label={`Notifications, ${portal.notifications} unread`}
                >
                    <Bell className="size-5" aria-hidden="true" />
                    <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-4 items-center justify-center rounded-full bg-critical px-1 text-[10px] font-bold leading-4 text-critical-foreground">
            {portal.notifications}
          </span>
                </button>

                <button
                    type="button"
                    className="flex items-center gap-2 rounded-md py-1 pl-1 pr-2 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    aria-label={`Account: ${portal.user.name}`}
                >
          <span
              className="inline-flex size-7 items-center justify-center rounded-full bg-white/15 text-xs font-semibold"
              aria-hidden="true"
          >
            {portal.user.initials}
          </span>
                    <span className="hidden text-sm font-medium sm:inline">{portal.user.name}</span>
                </button>
            </div>
        </header>
    )
}