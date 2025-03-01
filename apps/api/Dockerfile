FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@9.12.3

# Set working directory
WORKDIR /app

# Copy root workspace files needed for install
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy package.json files for all workspaces
COPY apps/api/package.json apps/api/
COPY apps/api/docker-entrypoint.sh apps/api/
COPY packages/typescript-config/package.json packages/typescript-config/
COPY packages/eslint-config/package.json packages/eslint-config/

# Fix the postinstall script to avoid error during build
RUN sed -i 's/"postinstall": "prisma generate"/"postinstall": "echo Skipping prisma generate during initial install"/g' apps/api/package.json

# Install dependencies (without BuildKit cache)
RUN pnpm install --frozen-lockfile

# Copy source files needed for build 
COPY packages/typescript-config packages/typescript-config/
COPY packages/eslint-config packages/eslint-config/
COPY apps/api/src apps/api/src/
COPY apps/api/prisma apps/api/prisma/
COPY apps/api/tsconfig.json apps/api/

# Setup Prisma
WORKDIR /app/apps/api

# First run prisma generate to create the client
RUN pnpm migrate:deploy || echo "Migration skipped in build phase, will run on container start"
RUN pnpm prisma:generate

# Build the app
RUN pnpm prebuild
RUN pnpm build

# Production stage
FROM node:20-alpine AS development

# Install pnpm
RUN npm install -g pnpm@9.12.3

# Default to production, will be overridden by .env.docker in development
ENV NODE_ENV=development

# Set working directory
WORKDIR /app

# Copy from build stage
COPY --from=base /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --from=base /app/apps/api/package.json /app/apps/api/
COPY --from=base /app/packages /app/packages

# Install production dependencies (without BuildKit cache)
RUN pnpm install --frozen-lockfile

# Copy remaining files from build stage
COPY --from=base /app/apps/api/dist /app/apps/api/dist
COPY --from=base /app/apps/api/prisma /app/apps/api/prisma
COPY --from=base /app/apps/api/docker-entrypoint.sh /app/apps/api/docker-entrypoint.sh
COPY apps/api/.env.example /app/apps/api/.env 

# Expose API port
EXPOSE 4000

# Set working directory to API app
WORKDIR /app/apps/api

# add persmissions for entrypoint-script script
RUN chmod +x ./docker-entrypoint.sh

# Start the application - using relative path from workdir
CMD ["/bin/sh", "./docker-entrypoint.sh"]