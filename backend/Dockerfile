FROM node:20-alpine

WORKDIR /app

# Copy package.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the application using tsx
CMD ["npx", "tsx", "src/index.ts"]
