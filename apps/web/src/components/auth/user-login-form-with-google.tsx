import { useState } from "react";
import { Button } from "@chomuon/ui/components/button";
import { Input } from "@chomuon/ui/components/input";
import { Label } from "@chomuon/ui/components/label";

export function UserLoginFormWithGoogle() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Mock submit
    setTimeout(() => {
      console.log("Login:", { email, password });
      setLoading(false);
    }, 1000);
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Đăng nhập</h1>
        <p className="text-sm text-muted-foreground">Chào mừng bạn quay lại ChoMuon</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            placeholder="ban@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">Mật khẩu</Label>
            <a href="/forgot-password" className="text-xs text-primary hover:underline">
              Quên mật khẩu?
            </a>
          </div>
          <Input
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground mt-1"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">hoặc</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Google login */}
      <button
        type="button"
        onClick={() => console.log("Google login")}
        className="flex items-center justify-center gap-3 w-full border border-border rounded-lg px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
      >
        {/* Google icon placeholder */}
        <span className="flex items-center justify-center w-5 h-5 rounded-full border border-border text-xs font-bold text-primary">
          G
        </span>
        Tiếp tục với Google
      </button>

      {/* Register link */}
      <p className="text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <a href="/register" className="text-primary hover:underline font-medium">
          Đăng ký ngay
        </a>
      </p>
    </div>
  );
}
