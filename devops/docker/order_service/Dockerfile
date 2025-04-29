# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY backend/order_service/package*.json ./
RUN npm ci
COPY backend/order_service ./
# RUN npm run build  # Replace with your build command if different

# Runtime stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
COPY backend/order_service/package*.json ./
# COPY package*.json ./

ENV NODE_ENV=production
EXPOSE 5003  
CMD ["npm", "run", "start:order"]  