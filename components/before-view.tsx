import { navGroups } from "@/lib/mock-data"

/**
 * Crude reproduction of the OLD dashboard, shown only via the Before/After
 * toggle so reviewers can contrast it with the redesign. Intentionally
 * unstyled-feeling: a marketing hero, equal-weight mismatched cards, no fleet
 * status, and a literal "Navigation" card that just re-lists the menu.
 */
export function BeforeView() {
  return (
    <div className="space-y-6">
      {/* Marketing hero — eats ~40% of the screen, says nothing useful */}
      <div className="flex min-h-56 flex-col items-center justify-center gap-2 rounded-md bg-neutral-200 p-8 text-center text-neutral-500">
        <span className="text-xs uppercase tracking-widest">[ stock photo ]</span>
        <p className="text-xl font-semibold text-neutral-600">Welcome to My TruckPoint</p>
        <p className="max-w-md text-sm">
          Your digital home for everything around your Mercedes-Benz Trucks fleet.
        </p>
      </div>

      {/* Equal-weight grid of unrelated cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-md border border-neutral-300 bg-neutral-100 p-4">
          <h3 className="mb-2 text-sm font-semibold text-neutral-700">About My TruckPoint</h3>
          <p className="text-sm text-neutral-500">
            My TruckPoint bundles digital services for your fleet. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit, sed do eiusmod tempor incididunt.
          </p>
        </div>

        <div className="rounded-md border border-neutral-300 bg-neutral-100 p-4">
          <h3 className="mb-2 text-sm font-semibold text-neutral-700">
            How satisfied are you?
          </h3>
          <p className="mb-3 text-sm text-neutral-500">Please rate your experience today.</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className="inline-flex size-8 items-center justify-center rounded-full border border-neutral-300 text-sm text-neutral-400"
              >
                {n}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-neutral-300 bg-neutral-100 p-4">
          <h3 className="mb-2 text-sm font-semibold text-neutral-700">Your profile</h3>
          <p className="text-sm text-neutral-500">Kari Nordmann</p>
          <p className="text-sm text-neutral-500">Daimler Truck AG (GER)</p>
        </div>

        {/* The tell-tale accidental "Navigation" card */}
        <div className="rounded-md border border-neutral-300 bg-neutral-100 p-4">
          <h3 className="mb-2 text-sm font-semibold text-neutral-700">Navigation</h3>
          <ul className="grid grid-cols-2 gap-1 text-sm text-neutral-500">
            {navGroups
              .filter((g) => g.id !== "dashboard")
              .flatMap((g) => g.items)
              .map((item) => (
                <li key={item.id}>{item.label}</li>
              ))}
          </ul>
        </div>
      </div>

      <p className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-3 text-center text-xs text-neutral-500">
        No fleet status anywhere — the one thing a manager logs in to check.
      </p>
    </div>
  )
}
