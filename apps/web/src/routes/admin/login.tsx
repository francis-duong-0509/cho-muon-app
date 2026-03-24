import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getAuthErrorMessage } from "@/lib/auth-error";
import { Button } from "@chomuon/ui/components/button";
import { Input } from "@chomuon/ui/components/input";
import { Label } from "@chomuon/ui/components/label";
import { Spinner } from "@/components/ui/spinner";
import { ShieldCheck, Lock, Mail } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signInError } = await authClient.signIn.email({ email, password });

    if (signInError) {
      setError(getAuthErrorMessage(signInError.code));
      setLoading(false);
      return;
    }

    // Check admin role after sign in
    const adminRoles = ["admin", "super_admin"];
    if (!adminRoles.includes(data?.user?.role ?? "")) {
      await authClient.signOut();
      setError("Bạn không có quyền truy cập trang quản trị.");
      setLoading(false);
      return;
    }

    window.location.href = "/admin";
    return;
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
          <p className="text-sm text-gray-500 mt-1">Đăng nhập vào trang quản trị</p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="admin-email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="admin-email"
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

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-password" className="text-sm font-medium text-gray-700">
                  Mật khẩu
                </Label>
                <Link
                  to="/admin/forgot-password"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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
                  <Spinner variant="inline" /> Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Chỉ dành cho quản trị viên được cấp quyền.
        </p>
      </div>
    </div>
  );
}
