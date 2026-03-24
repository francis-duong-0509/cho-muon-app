import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck } from "lucide-react";

export const Route = createFileRoute("/dashboard/bookings")({
  component: BookingsPage,
});

function BookingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Đơn thuê</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quản lý các đơn thuê đồ của bạn.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-xl">
        <CalendarCheck className="w-12 h-12 text-muted-foreground/40 mb-4" />
        <p className="text-sm text-muted-foreground">Chưa có đơn thuê nào.</p>
        <p className="text-xs text-muted-foreground mt-1">
          Tính năng này sẽ được triển khai trong Phase 1D.
        </p>
      </div>
    </div>
  );
}
