import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@chomuon/ui/components/button";
import { Input } from "@chomuon/ui/components/input";
import { Label } from "@chomuon/ui/components/label";
import { Spinner } from "@/components/ui/spinner";
import { ShieldCheck, Mail, ArrowLeft, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/admin/forgot-password")({
  component: AdminForgotPasswordPage,
});

function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: forgotError } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (forgotError) throw new Error("Không thể gửi email.");
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Không thể gửi email. Vui lòng thử lại.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-svh bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo + title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Cho<span className="text-primary">Muon</span> Admin
          </h1>
          <p className="text-sm text-gray-500 mt-1">Đặt lại mật khẩu quản trị</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Đã gửi email</h2>
              <p className="text-sm text-gray-500 mb-6">
                Vui lòng kiểm tra hộp thư của <strong>{email}</strong> và làm theo hướng dẫn.
              </p>
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại đăng nhập
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="admin-forgot-email" className="text-sm font-medium text-gray-700">
                  Email đăng ký
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="admin-forgot-email"
                    type="email"
                    placeholder="admin@chomuon.vn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="pl-10"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Spinner variant="inline" /> Đang gửi...
                  </>
                ) : (
                  "Gửi link đặt lại mật khẩu"
                )}
              </Button>

              <div className="text-center">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Quay lại đăng nhập
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Chỉ dành cho quản trị viên được cấp quyền.
        </p>
      </div>
    </div>
  );
}
