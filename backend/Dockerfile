# ==========================
# Stage 1: Build React App
# ==========================
FROM node:18-alpine AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build React app for production
RUN npm run build

# ==========================
# Stage 2: Serve with lightweight web server
# ==========================
FROM nginx:alpine

# Copy built React app to Nginx html directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Copy custom Nginx config if needed (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
