import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")(
  {
    component: HomePage,
  },
);

function HomePage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">
          ChoMuon
        </h1>
        <p className="text-lg text-muted-foreground">
          Mọi thứ bạn cần — không cần phải mua.
        </p>
        <p className="text-sm text-muted-foreground/60">
          🚧 Đang xây dựng...
        </p>
      </div>
    </div>
  );
}
