import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Đăng nhập</h1>
        <p className="text-sm text-muted-foreground">
          🚧 Trang đăng nhập đang xây dựng...
        </p>
      </div>
    </div>
  );
}
