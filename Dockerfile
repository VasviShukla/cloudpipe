# ── Stage 1: Build ───────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY app/package*.json ./
RUN npm ci --only=production

# ── Stage 2: Production ───────────────────────────────────────
FROM node:18-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

WORKDIR /app

# Copy built dependencies from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY app/index.js ./

# Set ownership
RUN chown -R nodeuser:nodejs /app

# Switch to non-root user
USER nodeuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Set environment
ENV NODE_ENV=production

# Start the application
CMD ["node", "index.js"]
