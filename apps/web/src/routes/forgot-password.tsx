import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Input } from "@chomuon/ui/components/input";
import { Button } from "@chomuon/ui/components/button";
import { Label } from "@chomuon/ui/components/label";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: forgotError } = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (forgotError) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="flex flex-col gap-4 text-center max-w-sm">
          <div className="text-4xl">📧</div>
          <h2 className="text-xl font-bold">Kiểm tra email!</h2>
          <p className="text-sm text-muted-foreground">
            Nếu <strong>{email}</strong> tồn tại trong hệ thống,
            bạn sẽ nhận link đặt lại mật khẩu trong vài phút.
          </p>
          <Link to="/login" className="text-sm text-primary hover:underline">
            ← Quay lại đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <div>
          <h1 className="text-2xl font-bold">Quên mật khẩu?</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Nhập email và chúng tôi sẽ gửi link đặt lại mật khẩu.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="forgot-email">Email</Label>
            <Input
              id="forgot-email"
              type="email"
              placeholder="ban@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
          </Button>
        </form>

        <Link to="/login" className="text-center text-sm text-primary hover:underline">
          ← Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}
