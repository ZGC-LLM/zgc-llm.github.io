# syntax=docker/dockerfile:1

FROM node:22.23.1-alpine AS base

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable

WORKDIR /app

FROM base AS deps

# sharp and other native dependencies need glibc compatibility on Alpine.
RUN apk add --no-cache libc6-compat

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir=/pnpm/store

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# These values are public and are baked into the client/static output at build time.
ARG NEXT_PUBLIC_APPLICATION_URL
ARG NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY
ARG NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM
ARG NEXT_PUBLIC_SITE_URL=https://www.zgc-llm.org.cn
ENV NEXT_PUBLIC_APPLICATION_URL=$NEXT_PUBLIC_APPLICATION_URL \
    NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY=$NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY \
    NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM=$NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

FROM node:22.23.1-alpine AS runner

WORKDIR /app

ENV HOSTNAME=0.0.0.0 \
    NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN mkdir -p .next/cache \
    && chown -R nextjs:nodejs .next

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD ["wget", "--no-verbose", "--tries=1", "--spider", "http://127.0.0.1:3000/"]

CMD ["node", "server.js"]
