# ===== Stage 1: Build =====
FROM oven/bun:1.3.9-alpine AS builder

WORKDIR /app

# Layer cache: install deps first
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/
COPY apps/server/package.json ./apps/server/
COPY packages/ ./packages/

RUN bun install --frozen-lockfile

# Copy source and build
COPY apps/web/ ./apps/web/

# Build-time env: empty = relative URL (proxy mode)
ARG VITE_SERVER_URL=""
ENV VITE_SERVER_URL=${VITE_SERVER_URL}

RUN cd apps/web && bun run build

# ===== Stage 2: Runtime =====
FROM oven/bun:1.3.9-alpine AS runner

WORKDIR /app

# Copy workspace config for bun to resolve packages
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/
COPY apps/server/package.json ./apps/server/
COPY packages/ ./packages/

# Install ONLY production dependencies
RUN bun install --frozen-lockfile --production

# Copy built output from builder stage
COPY --from=builder /app/apps/web/dist ./apps/web/dist

EXPOSE 3001
ENV PORT=3001
CMD ["bun", "apps/web/dist/server/ssr-bun-render-handler.js"]
