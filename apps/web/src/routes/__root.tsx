import { Toaster } from "@chomuon/ui/components/sonner";
import type { QueryClient } from "@tanstack/react-query";
import React from "react";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : React.lazy(() =>
      import("@tanstack/react-router-devtools").then((m) => ({
        default: m.TanStackRouterDevtools,
      }))
    );
const ReactQueryDevtools = import.meta.env.PROD
  ? () => null
  : React.lazy(() =>
      import("@tanstack/react-query-devtools").then((m) => ({
        default: m.ReactQueryDevtools,
      }))
    );

import type { orpc } from "@/utils/orpc";

import appCss from "../index.css?url";

export interface RouterAppContext {
  orpc: typeof orpc;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ChoMuon — Mọi thứ bạn cần, không cần phải mua" },
      {
        name: "description",
        content:
          "Marketplace cho thuê đồ vật ngắn hạn P2P. Thuê những gì bạn cần, cho thuê những gì bạn có.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="vi" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="font-[Inter] antialiased">
        <Outlet />
        <Toaster richColors />
        <TanStackRouterDevtools position="bottom-left" />
        <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
