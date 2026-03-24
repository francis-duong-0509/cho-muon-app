import { Link } from "@tanstack/react-router"
import { Separator } from "@chomuon/ui/components/separator"

const FOOTER_COLUMNS = [
  {
    heading: "Khám phá",
    links: [
      { label: "Duyệt đồ cho thuê", href: "/browse" },
      { label: "Máy ảnh & Quay phim", href: "/browse?category=camera" },
      { label: "Cắm trại & Dã ngoại", href: "/browse?category=camping" },
      { label: "Đồ dùng sự kiện", href: "/browse?category=events" },
      { label: "Thể thao & Fitness", href: "/browse?category=sports" },
    ],
  },
  {
    heading: "Cho thuê đồ",
    links: [
      { label: "Đăng đồ cho thuê", href: "/login" },
      { label: "Cách hoạt động", href: "/how-it-works" },
      { label: "Phí & Thu nhập", href: "/how-it-works" },
      { label: "Chủ đồ uy tín", href: "/browse" },
    ],
  },
  {
    heading: "Hỗ trợ",
    links: [
      { label: "Câu hỏi thường gặp", href: "/policy" },
      { label: "Liên hệ chúng tôi", href: "/policy" },
      { label: "Báo cáo vấn đề", href: "/policy" },
    ],
  },
  {
    heading: "Pháp lý",
    links: [
      { label: "Điều khoản dịch vụ", href: "/policy" },
      { label: "Chính sách bảo mật", href: "/policy" },
      { label: "Chính sách đặt cọc", href: "/policy" },
      { label: "Quy định cho thuê", href: "/policy" },
    ],
  },
] as const

const SOCIAL_LINKS = [
  { label: "Facebook", icon: "f", href: "https://facebook.com" },
  { label: "Instagram", icon: "in", href: "https://instagram.com" },
  { label: "TikTok", icon: "tt", href: "https://tiktok.com" },
  { label: "Zalo", icon: "z", href: "https://zalo.me" },
] as const

const QUICK_STATS = [
  { value: "500+", label: "Đồ cho thuê" },
  { value: "200+", label: "Giao dịch" },
  { value: "150+", label: "Chủ đồ" },
  { value: "3", label: "Thành phố" },
]

export function SiteFooterWithNavLinks() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Stats strip */}
      <div className="border-b border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {QUICK_STATS.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-extrabold text-primary">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer body */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 w-fit">
              <span className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-sm">
                CM
              </span>
              <span className="font-extrabold text-lg text-white">
                Cho<span className="text-primary">Muon</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Marketplace P2P cho thuê đồ vật ngắn hạn. Thuê những gì bạn cần, cho thuê những gì bạn có.
            </p>

            {/* Social icons */}
            <div className="flex gap-2 mt-1">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-primary hover:text-primary-foreground text-gray-400 flex items-center justify-center text-xs font-bold transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* App download placeholder */}
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-2">Tải ứng dụng (sắp ra mắt)</p>
              <div className="flex gap-2">
                <span className="text-xs bg-gray-800 text-gray-400 px-3 py-1.5 rounded-lg border border-gray-700">
                  App Store
                </span>
                <span className="text-xs bg-gray-800 text-gray-400 px-3 py-1.5 rounded-lg border border-gray-700">
                  Google Play
                </span>
              </div>
            </div>
          </div>

          {/* Nav columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-white tracking-wide">
                {col.heading}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-gray-800" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © 2025 ChoMuon. Bảo lưu mọi quyền. Được vận hành tại Việt Nam 🇻🇳
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <a href="/policy" className="hover:text-gray-300 transition-colors">Điều khoản</a>
            <a href="/policy" className="hover:text-gray-300 transition-colors">Bảo mật</a>
            <a href="/policy" className="hover:text-gray-300 transition-colors">Cookie</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
