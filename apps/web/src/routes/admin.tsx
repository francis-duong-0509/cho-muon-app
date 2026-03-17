import { Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@chomuon/ui/components/skeleton";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      navigate({ to: "/login" });
    }
    if (!isPending && session && session.user.role !== "admin") {
      navigate({ to: "/" });
    }
  }, [isPending, session, navigate]);

  if (isPending) {
    return (
      <div className="flex h-svh items-center justify-center">
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex h-svh overflow-hidden">
      <main className="flex-1 overflow-auto bg-background p-6">
        <Outlet />
      </main>
    </div>
  );
}
