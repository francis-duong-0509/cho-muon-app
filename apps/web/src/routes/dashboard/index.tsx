import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import {
  Package,
  CalendarCheck,
  Star,
  TrendingUp,
} from "lucide-react";

/**
 * **Concept: Index Route**
 *
 * File: `routes/dashboard/index.tsx`
 * URL:  `/dashboard` (exact match)
 *
 * Đây là "index route" — page hiển thị khi user truy cập `/dashboard`
 * mà không có sub-path nào phía sau.
 *
 * Trong TanStack Router, `index.tsx` trong folder route
 * sẽ match khi URL = chính xác path của parent.
 * VD: `/dashboard` → render file này
 *     `/dashboard/listings` → render listings/index.tsx
 */
export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverviewPage,
});

function DashboardOverviewPage() {
  const { data: session } = authClient.useSession();

  const userName = session?.user?.name ?? "bạn";

  /**
   * Mock stat cards — sẽ được kết nối API thực ở Phase 1G (Notifications & Polish).
   * Hiện tại hiển thị cấu trúc UI trước để user hình dung dashboard.
   */
  const stats = [
    { label: "Đồ cho thuê", value: "—", icon: Package, color: "text-blue-600 bg-blue-50" },
    { label: "Đơn thuê", value: "—", icon: CalendarCheck, color: "text-emerald-600 bg-emerald-50" },
    { label: "Đánh giá TB", value: "—", icon: Star, color: "text-amber-600 bg-amber-50" },
    { label: "Doanh thu tháng", value: "—", icon: TrendingUp, color: "text-rose-600 bg-rose-50" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Xin chào, {userName}!
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Đây là tổng quan hoạt động tài khoản của bạn.
        </p>
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Hành động nhanh</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="/dashboard/listings/new"
            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <Package className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Đăng đồ cho thuê</p>
              <p className="text-xs text-muted-foreground">Tạo listing mới</p>
            </div>
          </a>
          <a
            href="/dashboard/profile/kyc"
            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <Star className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-sm font-medium">Xác minh tài khoản</p>
              <p className="text-xs text-muted-foreground">Hoàn tất KYC để bắt đầu</p>
            </div>
          </a>
        </div>
      </div>

      {/* Placeholder for recent activity */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-2">Hoạt động gần đây</h2>
        <p className="text-sm text-muted-foreground">
          Chưa có hoạt động nào. Hãy bắt đầu bằng việc đăng đồ cho thuê!
        </p>
      </div>
    </div>
  );
}
