# -------- Stage 1 (deps) --------
FROM node:20-alpine AS builder

WORKDIR /app

# Pull in patched Alpine packages (incl. OpenSSL)
RUN apk add --no-cache --upgrade libcrypto3 libssl3

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# -------- Stage 2 (runtime) --------
FROM node:20-alpine

WORKDIR /app

# Ensure runtime image also has patched OpenSSL libs
RUN apk add --no-cache --upgrade libcrypto3 libssl3

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app /app

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000

CMD ["node", "server.js"]