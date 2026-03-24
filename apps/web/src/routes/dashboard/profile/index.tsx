import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { User, Mail, Phone, Calendar } from "lucide-react";

/**
 * **Concept: Index Route cho `/dashboard/profile`**
 *
 * Đây là trang Profile chính hiển thị thông tin cá nhân.
 * `/dashboard/profile/kyc` sẽ là route con riêng (đã tồn tại).
 *
 * **Concept: `authClient.useSession()`**
 * → Hook reactive: component tự re-render khi session thay đổi.
 * → Trả về `{ data: session }` chứa `session.user` với thông tin user.
 * → Không cần gọi API riêng vì session đã được cache phía client.
 */
export const Route = createFileRoute("/dashboard/profile/")({
  component: ProfilePage,
});

function ProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  if (!user) return null;

  const profileFields = [
    { label: "Họ và tên", value: user.name, icon: User },
    { label: "Email", value: user.email, icon: Mail },
    { label: "Số điện thoại", value: (user as any).phone ?? "Chưa cập nhật", icon: Phone },
    { label: "Ngày tham gia", value: user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "—", icon: Calendar },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Hồ sơ cá nhân</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Thông tin tài khoản và cài đặt.
        </p>
      </div>

      {/* Profile card */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          {profileFields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.label} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground w-28 shrink-0">{field.label}</span>
                <span className="text-sm font-medium text-foreground">{field.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
