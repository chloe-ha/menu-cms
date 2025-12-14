# ==============================================================================
# 1. BUILD STAGE: Builds and compiles the NestJS application
# ==============================================================================
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY src ./src

RUN npm run build

# ==============================================================================
# 2. PRODUCTION STAGE: Creates the minimal runtime image
# ==============================================================================
FROM node:24-alpine AS production

WORKDIR /app

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

USER nestjs

EXPOSE 3000

CMD [ "node", "dist/main" ]
