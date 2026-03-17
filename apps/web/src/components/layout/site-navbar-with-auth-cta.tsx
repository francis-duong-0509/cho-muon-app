import { useState } from "react"
import { Link, useLocation, useNavigate } from "@tanstack/react-router"
import { buttonVariants } from "@chomuon/ui/components/button"
import { cn } from "@chomuon/ui/lib/utils"
import { authClient } from "@/lib/auth-client"
import UserMenu from "@/components/user-menu"

const NAV_LINKS: { label: string; to: "/" | "/browse" | "/how-it-works" }[] = [
  { label: "Trang chủ", to: "/" },
  { label: "Khám phá", to: "/browse" },
  { label: "Cách hoạt động", to: "/how-it-works" },
]

export function SiteNavbarWithAuthCta() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchVal, setSearchVal] = useState("")
  const { data: session } = authClient.useSession()
  const location = useLocation()
  const navigate = useNavigate()

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (searchVal.trim()) window.location.href = `/browse?q=${encodeURIComponent(searchVal.trim())}`
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
      <div className="bg-primary px-4 py-1 hidden md:flex items-center justify-between max-w-7xl mx-auto">
        <p className="text-xs text-primary-foreground/80">
          🎉 ChoMuon — Thuê đồ từ cộng đồng, tiết kiệm hơn mua mới!
        </p>
        <div className="flex items-center gap-4 text-xs text-primary-foreground/80">
          <a href="/how-it-works" className="hover:text-primary-foreground transition-colors">Cách hoạt động</a>
          <a href="/policy" className="hover:text-primary-foreground transition-colors">Chính sách</a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center gap-4">
          <Link to="/" className="shrink-0 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-sm leading-none">
              CM
            </span>
            <span className="font-extrabold text-lg tracking-tight text-gray-900 hidden sm:block">
              Cho<span className="text-primary">Muon</span>
            </span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto hidden md:flex">
            <div className="flex w-full rounded-lg border border-gray-200 overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Tìm đồ bạn cần thuê..."
                className="flex-1 px-4 py-2 text-sm outline-none bg-white text-gray-900 placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 text-sm font-medium transition-colors shrink-0"
              >
                Tìm
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2 ml-auto md:ml-0 shrink-0">
            <a
              href="/browse"
              className="hidden md:flex items-center gap-1.5 text-xs text-gray-600 hover:text-primary transition-colors px-2 py-1.5 rounded-lg hover:bg-primary/5"
            >
              <span className="text-base">🔖</span>
              <span>Đã lưu</span>
            </a>

            {/* UserMenu: tự handle isPending skeleton, session, và signOut+redirect */}
            <div className="hidden md:block">
              <UserMenu />
            </div>

            <a
              href="/list-item"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-2 rounded-lg transition-colors hidden md:block"
            >
              + Đăng đồ
            </a>

            <button
              className="md:hidden flex flex-col gap-1 p-2 text-gray-700"
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Toggle menu"
            >
              <span className={`block h-0.5 w-5 bg-current transition-transform duration-200 ${mobileOpen ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 bg-current transition-opacity duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 bg-current transition-transform duration-200 ${mobileOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 pb-1">
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "text-sm px-3 py-1.5 rounded-lg transition-colors font-medium",
                  active
                    ? "text-primary bg-primary/8"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {link.label}
                {active && <span className="block h-0.5 w-full bg-primary rounded-full mt-0.5 -mb-1" />}
              </Link>
            )
          })}
          <a href="/browse?category=camera" className="text-sm px-3 py-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">📷 Máy ảnh</a>
          <a href="/browse?category=camping" className="text-sm px-3 py-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">⛺ Cắm trại</a>
          <a href="/browse?category=events" className="text-sm px-3 py-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">🎉 Sự kiện</a>
          <a href="/browse?category=sports" className="text-sm px-3 py-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">🏋️ Thể thao</a>
        </nav>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-3 shadow-lg">
          <form onSubmit={handleSearch} className="flex rounded-lg border border-gray-200 overflow-hidden mb-4 focus-within:border-primary">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Tìm đồ thuê..."
              className="flex-1 px-3 py-2 text-sm outline-none bg-white"
            />
            <button type="submit" className="bg-primary text-primary-foreground px-4 text-sm font-medium">Tìm</button>
          </form>

          <nav className="flex flex-col gap-1 mb-4">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "text-sm px-3 py-2 rounded-lg font-medium transition-colors",
                    active ? "text-primary bg-primary/8" : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
          <div className="flex gap-2">
            {session ? (
              <button
                onClick={async () => {
                  await authClient.signOut()
                  setMobileOpen(false)
                  navigate({ to: "/" })
                }}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1 text-xs justify-center")}
              >
                Đăng xuất
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1 text-xs justify-center")}
              >
                Đăng nhập
              </Link>
            )}
            <a
              href="/list-item"
              className="flex-1 bg-primary text-primary-foreground text-xs font-semibold px-3 py-2 rounded-lg text-center transition-colors hover:bg-primary/90"
            >
              + Đăng đồ
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
