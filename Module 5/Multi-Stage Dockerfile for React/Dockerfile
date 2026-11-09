
# Stage 1: Build the React application
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy application source code
COPY . .

# Build React application
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine

# Copy production build from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80
