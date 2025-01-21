# Tahap pertama: Build
FROM node:18 AS build

# Set working directory di dalam container
WORKDIR /app

# Copy file package.json dan package-lock.json (atau yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Set environment variable untuk OpenSSL legacy provider
ENV NODE_OPTIONS=--openssl-legacy-provider

# Copy seluruh kode sumber
COPY . .

# Build aplikasi React
RUN npm run build

# Tahap kedua: Production
FROM nginx:alpine

# Copy hasil build React ke folder yang sesuai di dalam nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 untuk nginx
EXPOSE 80

# Jalankan nginx
CMD ["nginx", "-g", "daemon off;"]
