import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@chomuon/ui/components/tabs";
import { UserLoginFormWithGoogle } from "@/components/auth/user-login-form-with-google";
import { UserRegisterFormWithTerms } from "@/components/auth/user-register-form-with-terms";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 bg-zinc-900 flex-col items-center justify-center p-12 gap-8">
        <a href="/" className="flex items-center gap-3">
          <span className="text-3xl font-extrabold text-white tracking-tight">ChoMuon</span>
        </a>
        <div className="text-center max-w-xs">
          <p className="text-2xl font-bold text-white leading-snug mb-3">
            Cho thuê thông minh{"\n"}Sống tiện lợi hơn
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Hàng nghìn món đồ chất lượng đang chờ bạn — không cần mua, chỉ cần thuê.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {[
            { icon: "🔒", text: "Giao dịch an toàn & minh bạch" },
            { icon: "⭐", text: "Chủ đồ được xác minh" },
            { icon: "💬", text: "Hỗ trợ 24/7" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-zinc-300 text-sm">
              <span className="text-xl">{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — auth forms */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="md:hidden text-center mb-8">
            <a href="/" className="text-2xl font-extrabold text-foreground">ChoMuon</a>
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
