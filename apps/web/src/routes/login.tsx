import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@chomuon/ui/components/tabs";
import { UserLoginFormWithGoogle } from "@/components/auth/user-login-form-with-google";
import { UserRegisterFormWithTerms } from "@/components/auth/user-register-form-with-terms";
import { Lock, ShieldCheck, Star, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 bg-gray-950 flex-col items-center justify-center p-12 gap-10 relative overflow-hidden">
        {/* Amber glow background */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-primary/10 rounded-full blur-2xl translate-x-1/4 translate-y-1/4 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-sm">
          {/* Logo — identical to navbar */}
          <a href="/" className="flex items-center gap-3 self-start">
            <span className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-base leading-none shadow-lg shadow-primary/30">
              CM
            </span>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              Cho<span className="text-primary">Muon</span>
            </span>
          </a>

          {/* Headline */}
          <div className="self-start">
            <h2 className="text-3xl font-bold text-white leading-tight mb-3">
              Cho thuê thông minh,<br />
              <span className="text-primary">sống tiện lợi hơn.</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Hàng trăm món đồ chất lượng từ cộng đồng — không cần mua, chỉ cần thuê.
            </p>
          </div>

          {/* Trust points */}
          <div className="flex flex-col gap-3 w-full">
            {[
              { icon: <Lock className="w-5 h-5 text-primary" />, text: "Giao dịch an toàn & minh bạch" },
              { icon: <ShieldCheck className="w-5 h-5 text-primary" />, text: "Chủ đồ được xác minh danh tính" },
              { icon: <Star className="w-5 h-5 text-primary" />, text: "Đánh giá thực từ người dùng" },
              { icon: <MessageCircle className="w-5 h-5 text-primary" />, text: "Hỗ trợ giải quyết tranh chấp 24/7" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/8">
                <span className="shrink-0">{icon}</span>
                <span className="text-gray-300 text-sm">{text}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 w-full pt-2 border-t border-white/10">
            {[
              { v: "500+", l: "Sản phẩm" },
              { v: "150+", l: "Chủ đồ" },
              { v: "200+", l: "Giao dịch" },
            ].map(({ v, l }) => (
              <div key={l} className="text-center">
                <p className="text-xl font-extrabold text-primary">{v}</p>
                <p className="text-xs text-gray-500 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — auth forms */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="md:hidden text-center mb-8">
            <a href="/" className="inline-flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-sm shadow">CM</span>
              <span className="font-extrabold text-xl text-gray-900">Cho<span className="text-primary">Muon</span></span>
            </a>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="login" className="flex-1">Đăng nhập</TabsTrigger>
              <TabsTrigger value="register" className="flex-1">Đăng ký</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <UserLoginFormWithGoogle />
            </TabsContent>
            <TabsContent value="register">
              <UserRegisterFormWithTerms />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
