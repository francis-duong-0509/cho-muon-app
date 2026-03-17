# ChoMuon — Marketplace cho thuê đồ vật ngắn hạn

> Mọi thứ bạn cần — không cần phải mua.

Marketplace P2P cho phép người dùng tại Việt Nam đăng cho thuê hoặc thuê đồ vật từ người dùng khác trong thời gian ngắn hạn (theo ngày/tuần).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Monorepo** | Turborepo + Bun |
| **Backend** | Elysia (Bun) + oRPC |
| **Auth** | better-auth |
| **Database** | PostgreSQL 17 + Drizzle ORM |
| **Frontend** | TanStack Router + React 19 (SSR) |
| **UI** | shadcn/ui + Tailwind CSS v4 |
| **Deploy** | Docker multi-stage |

## Structure

```
cho-muon-app/
├── apps/
│   ├── server/          # Elysia API server
│   └── web/             # TanStack Router SSR app
├── packages/
│   ├── api/             # oRPC routers & procedures (@chomuon/api)
│   ├── auth/            # better-auth config (@chomuon/auth)
│   ├── config/          # shared TS config (@chomuon/config)
│   ├── db/              # Drizzle schema + migrations (@chomuon/db)
│   ├── env/             # environment validation (@chomuon/env)
│   └── ui/              # shadcn/ui components (@chomuon/ui)
├── docker-compose.yml
└── turbo.json
```

## Getting Started

```bash
# Install dependencies
bun install

# Start database
bun run db:start

# Push schema to database
bun run db:push

# Run dev server (frontend + backend)
bun run dev
```

## Docker

```bash
docker compose up --build
```
# cho-muon-app
