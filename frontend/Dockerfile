# Stage 1: Dependencies and Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally and then install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy the rest of your application code
COPY . .

# Build the Next.js application
RUN pnpm build

# Stage 2: Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Install pnpm globally in the runner stage
RUN npm install -g pnpm

# Copy necessary files from the builder stage
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port Next.js runs on
EXPOSE 3000

# Command to run the application
CMD ["pnpm", "start"] 