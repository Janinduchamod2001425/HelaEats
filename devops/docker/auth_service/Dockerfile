# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files from the correct nested location
COPY backend/auth_service/backend/package*.json ./
RUN npm install

# Copy the rest of the application code
COPY backend/auth_service/backend/ ./

# Runtime stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

ENV NODE_ENV=production
EXPOSE 5001
CMD ["node", "src/index.js"]