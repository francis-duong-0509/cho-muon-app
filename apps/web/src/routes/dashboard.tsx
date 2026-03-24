import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@chomuon/ui/components/skeleton";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteNavbarWithAuthCta } from "@/components/layout/site-navbar-with-auth-cta";
import { DashboardSidebarNav } from "@/components/dashboard/dashboard-sidebar-nav";
import { DashboardMobileBottomNav } from "@/components/dashboard/dashboard-mobile-bottom-nav";

/**
 * **Concept: Layout Route (TanStack Router)**
 *
 * `dashboard.tsx` là một **Layout Route** — nó KHÔNG render nội dung riêng,
 * mà chỉ cung cấp "khung" (shell) chung cho TẤT CẢ route con bắt đầu bằng `/dashboard/*`.
 *
 * Cách hoạt động:
 * ```
 * dashboard.tsx          → Layout (Navbar + Sidebar + <Outlet/>)
 * ├── dashboard/index.tsx      → <Outlet/> render "Tổng quan"
 * ├── dashboard/listings/      → <Outlet/> render "Đồ cho thuê"
 * └── dashboard/profile/kyc    → <Outlet/> render "KYC"
 * ```
 *
 * **Concept: `<Outlet />`**
 * → Component đặc biệt từ TanStack Router.
 * → Nó là "placeholder" — nơi render nội dung của route con hiện tại.
 * → Giống `{children}` trong React, nhưng tự động match theo URL.
 *
 * **Concept: Auth Guard trong Layout Route**
 * → Đặt auth check ở Layout Route = bảo vệ TẤT CẢ child routes.
 * → Không cần repeat code kiểm tra session ở mỗi page.
 * → `useEffect` + `useNavigate` redirect nếu chưa login.
 *
 * **Concept: `authClient.useSession()` (better-auth)**
 * → Custom hook từ thư viện `better-auth`.
 * → Trả về `{ data: session, isPending }`:
 *   - `isPending = true`: Đang check session (show skeleton)
 *   - `session = null`: Chưa login → redirect
 *   - `session = {...}`: Đã login → render dashboard
 */
export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  /**
   * **Concept: `useEffect` for side effects**
   * → Redirect là "side effect" — tác động bên ngoài React render cycle.
   * → useEffect chạy SAU khi component render xong.
   * → Dependencies [isPending, session, navigate]:
   *   Chỉ chạy lại khi 1 trong 3 giá trị này thay đổi.
   */
  useEffect(() => {
    if (isPending) return;
    if (!session) {
      navigate({ to: "/login" });
      return;
    }
    // Admin accounts should not access user dashboard
    const adminRoles = ["admin", "super_admin"];
    if (adminRoles.includes(session.user.role ?? "")) {
      navigate({ to: "/admin" });
    }
  }, [isPending, session, navigate]);

  if (isPending) {
    return (
      <div className="flex h-svh items-center justify-center">
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar — reused from main site */}
      <SiteNavbarWithAuthCta />

      {/*
       * Main content area: Sidebar + Page content
       * **Concept: max-w-7xl mx-auto**
       * → Giới hạn chiều rộng tối đa = 80rem (1280px), giống navbar.
       * → mx-auto = căn giữa container.
       * → Sidebar + Content đều nằm TRONG max-width này,
       *   không bị dính sát mép trái viewport.
       */}
      <div className="flex-1 max-w-7xl mx-auto w-full flex">
        {/* Desktop Sidebar — hidden on mobile */}
        <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-border px-3 py-6">
          <div className="mb-6 px-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              BẢNG ĐIỀU KHIỂN
            </h2>
          </div>
          <DashboardSidebarNav />
        </aside>

        {/* Page content — <Outlet/> renders the matched child route */}
        <main className="flex-1 min-w-0 overflow-auto">
          <div className="px-4 sm:px-8 py-6 pb-24 md:pb-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav — visible only on mobile */}
      <DashboardMobileBottomNav />
    </div>
  );
}
