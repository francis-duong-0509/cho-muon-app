import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

export const Route = createFileRoute("/dashboard/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Tin nhắn</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Trò chuyện với người cho thuê / người thuê.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-xl">
        <MessageCircle className="w-12 h-12 text-muted-foreground/40 mb-4" />
        <p className="text-sm text-muted-foreground">Chưa có tin nhắn nào.</p>
        <p className="text-xs text-muted-foreground mt-1">
          Tính năng này sẽ được triển khai trong Phase 1E.
        </p>
      </div>
    </div>
  );
}
