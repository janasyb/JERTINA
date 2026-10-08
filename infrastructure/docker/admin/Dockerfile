FROM node:20-alpine AS base
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
COPY services ./services
COPY scripts ./scripts
COPY .env.example ./.env.example

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate && pnpm install --frozen-lockfile

WORKDIR /app/apps/admin
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
