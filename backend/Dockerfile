# Use Node LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy prisma schema before npm install
# so postinstall can run prisma generate
COPY prisma ./prisma/

# Install all dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy remaining source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 5000

# Start app
CMD ["npm", "run", "start"]