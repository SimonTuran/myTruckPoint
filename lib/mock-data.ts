import {
  AlertTriangle,
  Bell,
  Boxes,
  Building2,
  CalendarClock,
  Car,
  ClipboardList,
  Cog,
  Contact,
  FileText,
  FolderClosed,
  Gauge,
  HeartPulse,
  History,
  LayoutDashboard,
  type LucideIcon,
  Package,
  ReceiptText,
  Settings2,
  ShieldCheck,
  ShoppingCart,
  Stethoscope,
  Truck,
  Wrench,
} from "lucide-react"

/* ---------------------------------------------------------------------------
 * Status colour system (used by BOTH the Zone A status tiles and the nav
 * count badges so they stay visually consistent):
 *   critical -> red       action needed now
 *   warning  -> amber      upcoming / due soon
 *   ok       -> green      all clear / healthy
 *   info     -> blue       informational / in progress
 * ------------------------------------------------------------------------ */
export type StatusLevel = "critical" | "warning" | "ok" | "info"

export interface NavItem {
  id: string
  label: string
  href: string
}

export interface NavGroupData {
  id: string
  label: string
  icon: LucideIcon
  /** Optional direct destination (used by the Dashboard root item). */
  href?: string
  items: NavItem[]
  /** Status-aware count badge. Tied into the status colour system. */
  badge?: { count: number; status: StatusLevel }
}

export interface StatusTileData {
  id: string
  label: string
  count: number
  status: StatusLevel
  /** One-line context shown when count > 0. */
  context: string
  /** Calm context shown when count === 0. */
  clearContext: string
  icon: LucideIcon
  /** Human label of the pre-filtered destination. */
  destinationLabel: string
  /** Group this tile belongs to (for the stub view). */
  group: string
  /** The applied filter, surfaced on the stub destination. */
  filter: string
}

export interface TaskTileData {
  id: string
  title: string
  subtitle: string
  icon: LucideIcon
  destinationLabel: string
}

/* --------------------------- Identity / chrome --------------------------- */

export const portal = {
  brand: "T-System Concept",
  company: "Daimler Truck AG (GER)",
  user: {
    name: "Kari Nordmann",
    initials: "KN",
  },
  notifications: 11,
}

/* ----------------------------- Navigation -------------------------------- */
// Re-cut into task-oriented groups (not the old system-centric menu).

function stub(label: string, group: string, filter = "") {
  const params = new URLSearchParams({ label, group })
  if (filter) params.set("filter", filter)
  return `/stub?${params.toString()}`
}

export const navGroups: NavGroupData[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    items: [],
  },
  {
    id: "fleet",
    label: "My Fleet",
    icon: Truck,
    items: [
      { id: "truck-fleet", label: "Truck fleet", href: stub("Truck fleet", "My Fleet") },
      { id: "vehicle-center", label: "Vehicle center", href: stub("Vehicle center", "My Fleet") },
      { id: "vehicle-groups", label: "Vehicle groups", href: stub("Vehicle groups", "My Fleet") },
      { id: "vehicle-data", label: "Vehicle data", href: stub("Vehicle data", "My Fleet") },
      {
        id: "health-ota",
        label: "Health & OTA status",
        href: stub("Health & OTA status", "My Fleet"),
      },
    ],
  },
  {
    id: "service",
    label: "Service & Workshop",
    icon: Wrench,
    badge: { count: 3, status: "warning" },
    items: [
      { id: "book-service", label: "Book service", href: stub("Book service", "Service & Workshop") },
      {
        id: "service-history",
        label: "Service history",
        href: stub("Service history", "Service & Workshop"),
      },
      {
        id: "fleet-health-check",
        label: "Fleet Health Check",
        href: stub("Fleet Health Check", "Service & Workshop"),
      },
    ],
  },
  {
    id: "orders",
    label: "Orders & Offers",
    icon: ShoppingCart,
    items: [
      { id: "orders", label: "Orders", href: stub("Orders", "Orders & Offers") },
      { id: "offers", label: "Offers", href: stub("Offers", "Orders & Offers") },
      {
        id: "configurator",
        label: "New truck configurator",
        href: stub("New truck configurator", "Orders & Offers"),
      },
    ],
  },
  {
    id: "contracts",
    label: "Contracts & Billing",
    icon: ReceiptText,
    badge: { count: 2, status: "warning" },
    items: [
      { id: "contracts", label: "Contracts", href: stub("Contracts", "Contracts & Billing") },
      {
        id: "itemized-bills",
        label: "Itemized bills",
        href: stub("Itemized bills", "Contracts & Billing"),
      },
    ],
  },
  {
    id: "documents",
    label: "Documents",
    icon: FolderClosed,
    items: [{ id: "file-storage", label: "File storage", href: stub("File storage", "Documents") }],
  },
  {
    id: "company",
    label: "Company & Account",
    icon: Building2,
    items: [
      { id: "company-profile", label: "Company profile", href: stub("Company profile", "Company & Account") },
      { id: "contacts", label: "Contacts", href: stub("Contacts", "Company & Account") },
      {
        id: "data-sharing",
        label: "Data-sharing settings",
        href: stub("Data-sharing settings", "Company & Account"),
      },
    ],
  },
]

/** Resolve a destination label to its nav group + item ids (for active state). */
export function resolveNav(label: string): { groupId: string; itemId: string | null } {
  for (const group of navGroups) {
    const item = group.items.find((i) => i.label === label)
    if (item) return { groupId: group.id, itemId: item.id }
    if (group.label === label || group.href === label) return { groupId: group.id, itemId: null }
  }
  return { groupId: "", itemId: null }
}

/* Icon lookup for sub-items shown on stub pages, keyed by item id. */
export const itemIcons: Record<string, LucideIcon> = {
  "truck-fleet": Truck,
  "vehicle-center": Car,
  "vehicle-groups": Boxes,
  "vehicle-data": Gauge,
  "health-ota": HeartPulse,
  "book-service": CalendarClock,
  "service-history": History,
  "fleet-health-check": Stethoscope,
  orders: Package,
  offers: ClipboardList,
  configurator: Cog,
  contracts: FileText,
  "itemized-bills": ReceiptText,
  "file-storage": FolderClosed,
  "company-profile": Building2,
  contacts: Contact,
  "data-sharing": Settings2,
}

/* --------------------- Zone A — Status strip tiles ----------------------- */

export const statusTiles: StatusTileData[] = [
  {
    id: "vehicles-attention",
    label: "Vehicles needing attention",
    count: 4,
    status: "critical",
    context: "active warnings across fleet",
    clearContext: "no active warnings",
    icon: AlertTriangle,
    destinationLabel: "Truck fleet",
    group: "My Fleet",
    filter: "warnings",
  },
  {
    id: "service-due",
    label: "Service due",
    count: 3,
    status: "warning",
    context: "due within 7 days · 1 overdue",
    clearContext: "nothing due",
    icon: Wrench,
    destinationLabel: "Service & Workshop",
    group: "Service & Workshop",
    filter: "due",
  },
  {
    id: "expiring",
    label: "Contracts & documents expiring",
    count: 2,
    status: "warning",
    context: "expiring in next 30 days",
    clearContext: "nothing expiring soon",
    icon: ShieldCheck,
    destinationLabel: "Contracts & Billing",
    group: "Contracts & Billing",
    filter: "expiring",
  },
  {
    id: "in-progress",
    label: "Orders & updates in progress",
    count: 5,
    status: "info",
    context: "2 orders in transit · 3 OTA pending",
    clearContext: "nothing in progress",
    icon: Package,
    destinationLabel: "Orders & Offers",
    group: "Orders & Offers",
    filter: "in-progress",
  },
]

/* --------------------- Zone B — Primary task tiles ----------------------- */
// Tasks, not categories. The intentional replacement for the old
// accidental "Navigation" card.

export const taskTiles: TaskTileData[] = [
  {
    id: "view-fleet",
    title: "View truck fleet",
    subtitle: "See every vehicle, status and live warning in one list",
    icon: Truck,
    destinationLabel: "Truck fleet",
  },
  {
    id: "book-service",
    title: "Book / track service",
    subtitle: "Schedule maintenance or check open workshop cases",
    icon: Wrench,
    destinationLabel: "Service & Workshop",
  },
  {
    id: "manage-contracts",
    title: "Manage contracts",
    subtitle: "Review contracts and itemized bills in one place",
    icon: ReceiptText,
    destinationLabel: "Contracts & Billing",
  },
  {
    id: "documents",
    title: "Documents",
    subtitle: "Open shared files and fleet paperwork",
    icon: FolderClosed,
    destinationLabel: "File storage",
  },
  {
    id: "orders",
    title: "Orders",
    subtitle: "Track orders, offers and new truck configurations",
    icon: ShoppingCart,
    destinationLabel: "Orders & Offers",
  },
]

/* --------------------- Zone C — Contextual / personal -------------------- */

export const account = {
  name: portal.user.name,
  company: portal.company,
  initials: portal.user.initials,
  dataProcessing: true,
}

export const servicesInfo = {
  title: "Daimler Truck Services",
  body: "Financing, insurance, telematics and uptime services tailored to your fleet. Explore the programmes that keep your trucks earning.",
  linkLabel: "Explore services",
}

export const helpInfo = {
  title: "Help & contact",
  body: "Reach your fleet support team or browse guided answers.",
  linkLabel: "Get help",
}

/* Shared icons re-exported for convenience. */
export { Bell }
