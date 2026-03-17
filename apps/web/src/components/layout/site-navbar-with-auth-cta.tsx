import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { Button } from "@chomuon/ui/components/button"
import { buttonVariants } from "@chomuon/ui/components/button"
import { cn } from "@chomuon/ui/lib/utils"

const NAV_LINKS: { label: string; to: "/" | "/browse" | "/how-it-works" }[] = [
  { label: "Trang chủ", to: "/" },
  { label: "Khám phá", to: "/browse" },
  { label: "Cách hoạt động", to: "/how-it-works" },
]

export function SiteNavbarWithAuthCta() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <span className="text-primary font-bold text-xl">
              Cho<span className="text-foreground">Muon</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/login"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Đăng nhập
            </Link>
            <Button variant="default" size="sm">
              Đăng đồ
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 text-foreground"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span className={`block h-0.5 w-5 bg-current transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-current transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-current transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-3 mb-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2">
            <Link
              to="/login"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              onClick={() => setMobileOpen(false)}
            >
              Đăng nhập
            </Link>
            <Button variant="default" size="sm">
              Đăng đồ
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
