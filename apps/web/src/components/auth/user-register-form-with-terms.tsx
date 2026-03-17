import { useState } from "react";
import { Button } from "@chomuon/ui/components/button";
import { Input } from "@chomuon/ui/components/input";
import { Label } from "@chomuon/ui/components/label";
import { Checkbox } from "@chomuon/ui/components/checkbox";

export function UserRegisterFormWithTerms() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreedToTerms) return;
    setLoading(true);
    // Mock submit
    setTimeout(() => {
      console.log("Register:", { fullName, email, phone, password, confirmPassword });
      setLoading(false);
    }, 1000);
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Đăng ký</h1>
        <p className="text-sm text-muted-foreground">Tạo tài khoản ChoMuon miễn phí</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Họ và tên */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="register-fullname">Họ và tên</Label>
          <Input
            id="register-fullname"
            type="text"
            placeholder="Nguyễn Văn A"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            type="email"
            placeholder="ban@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        {/* Số điện thoại */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="register-phone">Số điện thoại</Label>
          <Input
            id="register-phone"
            type="tel"
            placeholder="0901 234 567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            autoComplete="tel"
          />
        </div>

        {/* Mật khẩu */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="register-password">Mật khẩu</Label>
          <Input
            id="register-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        {/* Xác nhận mật khẩu */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="register-confirm-password">Xác nhận mật khẩu</Label>
          <Input
            id="register-confirm-password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        {/* Terms checkbox */}
        <div className="flex items-start gap-2 pt-1">
          <Checkbox
            id="register-terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
            className="mt-0.5"
          />
          <Label htmlFor="register-terms" className="text-sm leading-snug cursor-pointer">
            Tôi đồng ý với{" "}
            <a href="/terms" className="text-primary hover:underline">
              Điều khoản dịch vụ
            </a>{" "}
            và{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Chính sách bảo mật
            </a>
          </Label>
        </div>

        <Button
          type="submit"
          disabled={!agreedToTerms || loading}
          className="w-full bg-primary text-primary-foreground mt-1"
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </Button>
      </form>

      {/* Login link */}
      <p className="text-center text-sm text-muted-foreground">
        Đã có tài khoản?{" "}
        <a href="/login" className="text-primary hover:underline font-medium">
          Đăng nhập
        </a>
      </p>
    </div>
  );
}
