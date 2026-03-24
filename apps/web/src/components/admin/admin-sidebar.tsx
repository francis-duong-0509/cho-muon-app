import { useLocation } from "@tanstack/react-router";
import { cn } from "@chomuon/ui/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShieldCheck,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const NAV_ITEMS: { label: string; to: string; icon: React.ElementType; exact?: boolean }[] = [
  { label: "Tổng quan", to: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Quản lý đồ", to: "/admin/listings", icon: Package },
  { label: "Xác minh KYC", to: "/admin/kyc", icon: ShieldCheck },
  { label: "Người dùng", to: "/admin/users", icon: Users },
  { label: "Đơn thuê", to: "/admin/bookings", icon: ClipboardList },
  { label: "Cài đặt", to: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  session: { user: { name: string; email: string } };
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ session, mobileOpen, onClose }: AdminSidebarProps) {
  const location = useLocation();

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 shrink-0">
        <a href="/admin" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-sm leading-none">
            CM
          </span>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-gray-900 tracking-tight">
              Cho<span className="text-primary">Muon</span>
            </span>
            <span className="text-[10px] text-gray-400 font-medium -mt-0.5 tracking-wider uppercase">
              Admin Panel
            </span>
          </div>
        </a>
        {/* Mobile close button */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.to, item.exact);
          return (
            <a
              key={item.to}
              href={item.to}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                active
                  ? "bg-primary/8 text-primary shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("w-4.5 h-4.5 shrink-0", active ? "text-primary" : "text-gray-400")} />
              <span>{item.label}</span>
              {/* KYC pending badge placeholder */}
              {item.to === "/admin/kyc" && (
                <span className="ml-auto text-[10px] font-bold bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
                  !
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* User section + Logout */}
      <div className="border-t border-gray-100 px-3 py-3 shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
            {session.user.name?.charAt(0).toUpperCase() ?? "A"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 truncate">{session.user.name}</p>
            <p className="text-[11px] text-gray-400 truncate">{session.user.email}</p>
          </div>
        </div>
        <button
          onClick={async () => {
            await authClient.signOut();
            window.location.href = "/admin/login";
          }}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-65 border-r border-gray-100 bg-white flex-col shrink-0 h-full">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={onClose} />
          <aside className="fixed inset-y-0 left-0 z-50 w-70 bg-white shadow-xl lg:hidden flex flex-col">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
