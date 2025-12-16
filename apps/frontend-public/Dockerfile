# ==============================================================================
# 1. BUILD STAGE: Builds and compiles the NestJS application
# ==============================================================================
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Next.js collects anonymous telemetry data about general usage.
# Uncomment the following line to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1
ARG BACKEND_API_URL
ENV BACKEND_API_URL=$BACKEND_API_URL

RUN npm run build

# ==============================================================================
# 2. PRODUCTION STAGE: Creates the minimal runtime image
# ==============================================================================
FROM node:24-alpine AS runner

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ARG BACKEND_API_URL
ENV BACKEND_API_URL=$BACKEND_API_URL

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/app/api-reference/config/next-config-js/output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use node to run the standalone server
CMD ["node", "server.js"]
