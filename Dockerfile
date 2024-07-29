# Base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy all source files
COPY . .

# Build the application
RUN yarn build

# Stage 2 - Create the production image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Copy built files from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy the .env and .env.development files
# COPY .env .env.development ./

# Expose the port on which the app will run
EXPOSE 3000

# Start the server using the production build
CMD ["node", "dist/src/main"]
