# Use lightweight Node image
FROM node:20-alpine

# App directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy project files
COPY . .

# Expose service port
EXPOSE 8005

# Start service
CMD ["npm", "start"]
