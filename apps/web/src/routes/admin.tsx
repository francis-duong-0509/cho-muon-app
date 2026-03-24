import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

const ADMIN_ROLES = ["admin", "super_admin"];

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

/**
 * Admin Layout — Conditional rendering based on route:
 *
 * PUBLIC routes (/admin/login, /admin/forgot-password):
 *   → Render only <Outlet /> (no sidebar, no auth guard)
 *
 * PROTECTED routes (/admin, /admin/kyc, etc.):
 *   → Auth guard (must be admin role)
 *   → Full dashboard layout (sidebar + header + content)
 */
function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const PUBLIC_PATHS = ["/admin/login", "/admin/forgot-password"];
  const isPublicPage = PUBLIC_PATHS.includes(location.pathname);

  // Auth guard — only for protected pages
  useEffect(() => {
    if (isPublicPage || isPending) return;

    if (!session) {
      navigate({ to: "/admin/login" });
    } else if (!ADMIN_ROLES.includes(session.user.role ?? "")) {
      navigate({ to: "/" });
    }
  }, [isPending, session, navigate, isPublicPage]);

  // Public pages — render without layout
  if (isPublicPage) {
    return <Outlet />;
  }

  // Loading state
  if (isPending) {
    return <Spinner variant="page" />;
  }

  // Not authenticated or not admin
  if (!session || !ADMIN_ROLES.includes(session.user.role ?? "")) {
    return null;
  }

  // Authenticated admin — full dashboard layout
  return (
    <div className="flex h-svh bg-gray-50 overflow-hidden">
      <AdminSidebar
        session={session}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          session={session}
          onMenuToggle={() => setMobileSidebarOpen((p) => !p)}
        />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
