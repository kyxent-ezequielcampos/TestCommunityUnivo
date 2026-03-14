# Backend Dockerfile (for Dokku / container deployment)
# Uses Bun runtime + Elysia + MongoDB

FROM oven/bun:latest

WORKDIR /app

# Copy dependency definitions first to leverage Docker cache
COPY package.json bun.lock ./

RUN bun install --production

# Copy source files
COPY . .

EXPOSE 3000

CMD ["bun", "run", "start"]
