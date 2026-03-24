import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@chomuon/ui/lib/utils";
import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  MessageCircle,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Mobile bottom nav items — only show 5 most important tabs.
 * Full list is in the sidebar (desktop), but mobile space is limited.
 *
 * **Concept: Progressive Disclosure**
 * → Không nên hiển thị hết tất cả trên mobile.
 * → Chọn 5 tab quan trọng nhất cho bottom bar.
 * → Các tab còn lại (Thông báo, KYC) truy cập qua menu Profile.
 */
interface BottomNavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  matchExact?: boolean;
}

const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { label: "Tổng quan", to: "/dashboard", icon: LayoutDashboard, matchExact: true },
  { label: "Đồ thuê", to: "/dashboard/listings", icon: Package },
  { label: "Đơn thuê", to: "/dashboard/bookings", icon: CalendarCheck },
  { label: "Tin nhắn", to: "/dashboard/messages", icon: MessageCircle },
  { label: "Hồ sơ", to: "/dashboard/profile", icon: User },
];

/**
 * DashboardMobileBottomNav — Fixed bottom navigation bar for mobile.
 *
 * **Concept: Fixed Positioning + Safe Area**
 * → `fixed bottom-0` giữ nav bar luôn ở dưới cùng màn hình.
 * → `pb-[env(safe-area-inset-bottom)]` xử lý iPhone có notch/home indicator.
 * → `z-50` đảm bảo nav bar luôn nằm trên content.
 *
 * **Concept: `md:hidden` — Responsive Visibility**
 * → Tailwind breakpoint `md` = 768px.
 * → `md:hidden` = ẩn khi màn hình >= 768px (desktop dùng sidebar).
 * → Ngược lại sidebar dùng `hidden md:flex` = chỉ hiện trên desktop.
 */
export function DashboardMobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-14">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = item.matchExact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);

          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 min-w-12 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
