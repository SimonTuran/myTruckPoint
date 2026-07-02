export function Footer() {
  const links = [
    { label: "Cookies", href: "/cookies" },
    { label: "Rechtliche Hinweise", href: "/rechtliche-hinweise" },
    { label: "Datenschutz", href: "/datenschutz" },
  ]

  return (
    <footer className="flex h-12 items-center justify-end gap-3 bg-header px-4 text-xs text-header-muted sm:px-6">
      <span>© 2026 Daimler Truck AG, Alle Rechte vorbehalten (Anbieter)</span>
      {links.map((link) => (
        <span key={link.href} className="flex items-center gap-3">
          <span className="h-3 w-px bg-white/15" aria-hidden="true" />
          <a href={link.href} className="hover:text-header-foreground hover:underline">
            {link.label}
          </a>
        </span>
      ))}
    </footer>
  )
}