import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/dashboard/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Thông báo</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Cập nhật về đơn thuê, tin nhắn và hoạt động.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-xl">
        <Bell className="w-12 h-12 text-muted-foreground/40 mb-4" />
        <p className="text-sm text-muted-foreground">Chưa có thông báo nào.</p>
        <p className="text-xs text-muted-foreground mt-1">
          Tính năng này sẽ được triển khai trong Phase 1G.
        </p>
      </div>
    </div>
  );
}
