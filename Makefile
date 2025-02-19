# Makefile in root directory
.PHONY: help setup env-setup up down build logs ps clean dev-up dev-build db-migrate db-generate install status services-up services-down services-logs fix-permissions setup-dirs configure-pgadmin

# volumes
DOCKER_DATA_DIR := data
POSTGRES_DATA_DIR := $(DOCKER_DATA_DIR)/postgres
PGADMIN_DATA_DIR := $(DOCKER_DATA_DIR)/pgadmin


configure-pgadmin:
	@echo "Configuring pgAdmin..."
	@echo '{"Servers":{"1":{"Name":"Insomnia Wallet DB","Group":"Servers","Host":"insomnia-wallet-postgres","Port":5432,"MaintenanceDB":"$(POSTGRES_DB)","Username":"$(POSTGRES_USER)","SSLMode":"prefer","PassFile":"/pgpass"}}}' > services/postgres/pgadmin_init.json
	@echo "insomnia-wallet-postgres:5432:$(POSTGRES_DB):$(POSTGRES_USER):$(POSTGRES_PASSWORD)" > services/postgres/.pgpass
	@chmod 600 services/postgres/.pgpass

# Default environment
ENV ?= development

# Docker compose files
DC_FILES := -f docker-compose.yml
SERVICES_DC := -f services/postgres/docker-compose.yml

# If development environment, add development overrides
ifeq ($(ENV),development)
	DC_FILES += -f docker-compose.dev.yml
endif

# Docker compose commands
DC := docker compose $(DC_FILES)
DC_SERVICES := docker compose $(SERVICES_DC)

# HELP
help: ## Display this help message
	@printf "\n"
	@printf "  🔑 Insomnia Wallet Makefile Help\n"
	@printf "\n"
	@printf "Usage:\n"
	@printf "  make [target] [ENV=development|production]\n"
	@printf "\n"
	@printf "Setup Commands:\n"
	@printf "  %-20s %s\n" "setup" "Complete initial setup (env files, dependencies, DB client)"
	@printf "  %-20s %s\n" "env-setup" "Create environment files from examples"
	@printf "  %-20s %s\n" "install" "Install all dependencies"
	@printf "\n"
	@printf "Service Commands:\n"
	@printf "  %-20s %s\n" "services-up" "Start only PostgreSQL and pgAdmin services"
	@printf "  %-20s %s\n" "services-down" "Stop only PostgreSQL and pgAdmin services"
	@printf "  %-20s %s\n" "services-logs" "Show logs from PostgreSQL and pgAdmin services"
	@printf "\n"
	@printf "Docker Commands:\n"
	@printf "  %-20s %s\n" "up" "Start all services"
	@printf "  %-20s %s\n" "down" "Stop all services"
	@printf "  %-20s %s\n" "build" "Build all services"
	@printf "  %-20s %s\n" "logs" "Show service logs"
	@printf "  %-20s %s\n" "ps" "List running services"
	@printf "  %-20s %s\n" "clean" "Remove all containers, volumes, and networks"
	@printf "\n"
	@printf "Development Commands:\n"
	@printf "  %-20s %s\n" "dev-up" "Start development environment"
	@printf "  %-20s %s\n" "dev-build" "Build development environment"
	@printf "\n"
	@printf "Database Commands:\n"
	@printf "  %-20s %s\n" "db-migrate" "Run database migrations"
	@printf "  %-20s %s\n" "db-generate" "Generate Prisma client"
	@printf "\n"
	@printf "Environment Variables:\n"
	@printf "  %-20s %s\n" "ENV" "Development or production mode (default: development)"
	@printf "\n"

# Default target
.DEFAULT_GOAL := help

# Service management commands
services-up: env-setup configure-pgadmin ## Start only PostgreSQL and pgAdmin services
	@echo "Starting PostgreSQL and pgAdmin services..."
	$(DC_SERVICES) up -d

services-down: ## Stop only PostgreSQL and pgAdmin services
	@echo "Stopping PostgreSQL and pgAdmin services..."
	$(DC_SERVICES) down

services-logs: ## Show logs from PostgreSQL and pgAdmin services
	@echo "Showing PostgreSQL and pgAdmin service logs..."
	$(DC_SERVICES) logs -f

# Setup commands
setup: env-setup install db-generate ## Complete initial setup (env files, dependencies, DB client)

env-setup: ## Create environment files from examples
	@echo "Setting up environment files..."
	@chmod +x scripts/setup-env.sh
	@./scripts/setup-env.sh

# Docker commands
up: env-setup ## Start all services
	@echo "Starting all services..."
	$(DC) up -d

down: ## Stop all services
	@echo "Stopping all services..."
	$(DC) down

build: env-setup setup-dirs fix-permissions ## Build all services
	@echo "Building all services..."
	$(DC) build --no-cache

logs: ## Show service logs
	@echo "Showing logs..."
	$(DC) logs -f

ps: ## List running services
	@echo "Showing running services..."
	$(DC) ps

clean: ## Remove all containers, volumes, and networks
	@echo "Cleaning up..."
	$(DC) down -v --remove-orphans
	$(DC_SERVICES) down -v --remove-orphans
	@rm -rf $(DOCKER_DATA_DIR)/*
	@echo "Clean up complete"

# Development specific commands
dev-up: env-setup ## Start development environment
	@echo "Starting development environment..."
	make up ENV=development

dev-build: env-setup ## Build development environment
	@echo "Building development environment..."
	make build ENV=development

# Database commands
db-migrate: ## Run database migrations
	@echo "Running database migrations..."
	cd packages/server && pnpm prisma migrate deploy

db-generate: ## Generate Prisma client
	@echo "Generating Prisma client..."
	cd packages/server && pnpm prisma generate

# Install dependencies
install: ## Install all dependencies
	@echo "Installing dependencies..."
	pnpm install