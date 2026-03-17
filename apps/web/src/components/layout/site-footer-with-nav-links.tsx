import { Link } from "@tanstack/react-router"
import { Separator } from "@chomuon/ui/components/separator"

const FOOTER_COLUMNS = [
  {
    heading: "Khám phá",
    links: [
      { label: "Duyệt đồ cho thuê", href: "/browse" },
      { label: "Danh mục", href: "/browse/categories" },
    ],
  },
  {
    heading: "Hỗ trợ",
    links: [
      { label: "Câu hỏi thường gặp", href: "/faq" },
      { label: "Liên hệ", href: "/contact" },
      { label: "Cách hoạt động", href: "/how-it-works" },
    ],
  },
  {
    heading: "Pháp lý",
    links: [
      { label: "Điều khoản sử dụng", href: "/terms" },
      { label: "Chính sách bảo mật", href: "/privacy" },
    ],
  },
] as const

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "TikTok", href: "https://tiktok.com" },
] as const

export function SiteFooterWithNavLinks() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Top: brand + columns */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link to="/">
              <span className="text-primary font-bold text-xl">
                Cho<span className="text-foreground">Muon</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Mọi thứ bạn cần — không cần phải mua.
            </p>
            <div className="flex gap-4 mt-2">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-foreground">
                {col.heading}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <p className="text-xs text-muted-foreground text-center">
          © 2025 ChoMuon. Bảo lưu mọi quyền.
        </p>
      </div>
    </footer>
  )
}
