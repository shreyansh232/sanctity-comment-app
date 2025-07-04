# Use a Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./ 

# Install dependencies using pnpm
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the TypeScript application
RUN pnpm build

# Expose the port your Express app runs on
EXPOSE 8088

# Command to run the application
CMD ["pnpm", "start"] 