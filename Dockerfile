# Build backend
FROM node:20-alpine

WORKDIR /app

# Copy backend files
COPY backend/ .

# Install dependencies
RUN npm install

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
