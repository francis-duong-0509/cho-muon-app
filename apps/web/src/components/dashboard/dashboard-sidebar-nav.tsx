import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@chomuon/ui/lib/utils";
import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  MessageCircle,
  Bell,
  User,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Navigation item definition.
 * - `to`: Route path for TanStack Router navigation
 * - `icon`: Lucide icon component (tree-shakable)
 * - `badge`: Optional notification count
 * - `matchExact`: Whether to match only exact path (default: prefix match)
 */
interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: number;
  matchExact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Tổng quan", to: "/dashboard", icon: LayoutDashboard, matchExact: true },
  { label: "Đồ cho thuê", to: "/dashboard/listings", icon: Package },
  { label: "Đơn thuê", to: "/dashboard/bookings", icon: CalendarCheck },
  { label: "Tin nhắn", to: "/dashboard/messages", icon: MessageCircle },
  { label: "Thông báo", to: "/dashboard/notifications", icon: Bell },
  { label: "Hồ sơ", to: "/dashboard/profile", icon: User, matchExact: true },
  { label: "Xác minh KYC", to: "/dashboard/profile/kyc", icon: ShieldCheck },
];

/**
 * DashboardSidebarNav — Vertical tab navigation for the User Dashboard.
 *
 * **Concept: `useLocation()` (TanStack Router)**
 * → `useLocation()` trả về object chứa thông tin URL hiện tại.
 * → Ta dùng `location.pathname` để xác định tab nào đang active.
 * → Có 2 mode matching:
 *   - `matchExact: true` → chỉ match chính xác path (vd: `/dashboard` không match `/dashboard/listings`)
 *   - `matchExact: false` (default) → prefix match (vd: `/dashboard/listings` match cả `/dashboard/listings/new`)
 *
 * **Concept: Lucide Icon as Component**
 * → Mỗi icon trong `lucide-react` là một React component (`LucideIcon` type).
 * → Ta truyền icon qua props như một component: `<item.icon className="..." />`
 * → Tree-shaking: chỉ import icon cần dùng, không load toàn bộ library.
 */
export function DashboardSidebarNav() {
  const location = useLocation();

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        /**
         * Active state detection:
         * - matchExact=true: pathname phải === item.to
         * - matchExact=false: pathname phải startsWith(item.to)
         *   → Giúp `/dashboard/listings/new` vẫn highlight tab "Đồ cho thuê"
         */
        const isActive = item.matchExact
          ? location.pathname === item.to
          : location.pathname.startsWith(item.to);

        const Icon = item.icon;

        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="w-4.5 h-4.5 shrink-0" />
            <span className="truncate">{item.label}</span>
            {item.badge != null && item.badge > 0 && (
              <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center leading-none">
                {item.badge > 99 ? "99+" : item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
