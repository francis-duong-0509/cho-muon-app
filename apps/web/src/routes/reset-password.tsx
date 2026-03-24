import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { Input } from "@chomuon/ui/components/input";
import { Button } from "@chomuon/ui/components/button";
import { Label } from "@chomuon/ui/components/label";
import { XCircle, CheckCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/reset-password")({
  validateSearch: z.object({
    token: z.string().optional(),
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Token không có trong URL → link sai hoặc hết hạn
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="flex flex-col gap-4 text-center max-w-sm">
          <XCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold">Link không hợp lệ</h2>
          <p className="text-sm text-muted-foreground">
            Link đặt lại mật khẩu đã hết hạn hoặc không hợp lệ.
          </p>
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            Yêu cầu link mới
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }

    setLoading(true);
    setError(null);

    const { error: resetError } = await authClient.resetPassword({
      newPassword: password,
      token,
    });

    if (resetError) {
      setError("Link đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu link mới.");
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
          <CheckCircle className="w-10 h-10 text-green-500 mx-auto" />
          <h2 className="text-xl font-bold">Đặt lại mật khẩu thành công!</h2>
          <p className="text-sm text-muted-foreground">
            Mật khẩu của bạn đã được cập nhật.
          </p>
          <Link to="/login" className="text-sm text-primary hover:underline font-medium">
            Đăng nhập ngay →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <div>
          <h1 className="text-2xl font-bold">Tạo mật khẩu mới</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Mật khẩu tối thiểu 8 ký tự.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-password">Mật khẩu mới</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm-new-password">Xác nhận mật khẩu</Label>
            <Input
              id="confirm-new-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <><Spinner variant="inline" /> Đang cập nhật...</> : "Đặt lại mật khẩu"}
          </Button>
        </form>
      </div>
    </div>
  );
}
