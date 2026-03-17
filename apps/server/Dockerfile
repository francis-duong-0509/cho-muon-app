# ===== Stage 1: Build =====
FROM oven/bun:1.3.9-alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/
COPY packages/ ./packages/

RUN bun install --frozen-lockfile

COPY apps/server/ ./apps/server/

RUN cd apps/server && bun run build

# ===== Stage 2: Runtime =====
FROM oven/bun:1.3.9-alpine AS runner

WORKDIR /app

# Copy workspace config for bun to resolve external deps
COPY package.json bun.lock ./
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/
COPY packages/ ./packages/

# Install ALL dependencies (including drizzle-kit for migrations)
RUN bun install --frozen-lockfile

# Copy built bundle from builder
COPY --from=builder /app/apps/server/dist/index.mjs ./apps/server/dist/index.mjs

# Migration entrypoint script
COPY <<'EOF' /app/migrate.sh
#!/bin/sh
cd /app/packages/db && bun run db:migrate
EOF
RUN chmod +x /app/migrate.sh

EXPOSE 3000
CMD ["bun", "apps/server/dist/index.mjs"]