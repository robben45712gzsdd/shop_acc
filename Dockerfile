# Dockerfile
FROM node:23-alpine

# Set working directory
WORKDIR /app

# Copy package.json & package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build Nuxt project
RUN npm run build

# Expose port
EXPOSE 3000

# Set default command
CMD ["npm", "run", "start"]
