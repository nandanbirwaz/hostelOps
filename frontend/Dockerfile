FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine
WORKDIR /app

# Patch OpenSSL libs to satisfy Trivy (CVE-2025-15467)
RUN apk add --no-cache --upgrade libcrypto3 libssl3

# Use serve to host
RUN npm install -g serve

COPY --from=builder /app/dist ./dist


EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
