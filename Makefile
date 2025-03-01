SHELL := /bin/bash
.PHONY: services-up services-up-build services-down services-clean dev-up dev-down dev-clean setup-env check-dependencies configure-pgadmin db-setup db-migrate api-up api-down api-build api-up-build

# Include postgres environment variables
POSTGRES_ENV_FILE := ./services/postgres/.env
include $(POSTGRES_ENV_FILE)

# Environment Setup
setup-env: check-dependencies
	@echo "🔧 Setting up environment files..."
	@test -f ./services/postgres/.env || cp ./services/postgres/.env.example ./services/postgres/.env
	@test -f ./apps/web/.env || cp ./apps/web/.env.example ./apps/web/.env
	@test -f ./apps/api/.env || cp ./apps/api/.env.example ./apps/api/.env
	@echo "✅ Environment files setup complete"

# Configure PgAdmin
configure-pgadmin:
	@echo "🔧 Configuring pgAdmin..."
	@if [ ! -f "$(POSTGRES_ENV_FILE)" ]; then \
		echo "❌ Postgres environment file not found. Running setup-env first..."; \
		$(MAKE) setup-env; \
	fi
	@echo '{"Servers":{"1":{"Name":"Insomnia DB","Group":"Servers","Host":"${HOST}","Port":5432,"MaintenanceDB":"$(POSTGRES_DB)","Username":"$(POSTGRES_USER)","SSLMode":"prefer","PassFile":"/pgpass"}}}' > services/postgres/pgadmin_init.json 
	@echo "${HOST}:5432:$(POSTGRES_DB):$(POSTGRES_USER):$(POSTGRES_PASSWORD)" > services/postgres/.pgpass
	@chmod 600 services/postgres/.pgpass
	@echo "✅ pgAdmin configuration completed using variables from $(POSTGRES_ENV_FILE)"

# Database Setup and Migration
db-setup: configure-pgadmin
	@echo "🏗️  Setting up database..."
	@cd apps/api && pnpm prisma:generate
	@echo "✅ Database setup complete"

db-migrate-dev:
	@echo "🔄 Running database migrations..."
	@cd apps/api && pnpm migrate:dev  
	@echo "✅ Database migrations complete"

db-migrate:
	@echo "🔄 Running database migrations..."
	@cd apps/api && pnpm migrate:deploy 
	@echo "✅ Database migrations complete"

# Services Management
services-up: check-dependencies configure-pgadmin
	@echo "🚀 Starting services..."
	@cd services/postgres && docker compose up -d
	@echo "✅ Services started"

services-up-build: check-dependencies configure-pgadmin
	@echo "🏗️  Building and starting services..."
	@cd services/postgres && docker compose up -d --build
	@echo "✅ Services built and started"

services-down:
	@echo "🔽 Stopping services..."
	@cd services/postgres && docker compose down
	@echo "✅ Services stopped"

services-clean:
	@echo "🧹 Cleaning up services..."
	@cd services/postgres && docker compose down -v
	@rm -f .pgpass pgadmin_init.json 2>/dev/null || true
	@docker network rm insomnia-wallet-network 2>/dev/null || true
	@echo "✅ Services cleaned"

# Development Environment Management
dev-up: setup-env check-dependencies configure-pgadmin
	@echo "🚀 Starting development environment..."
	
	@echo "📦 Starting Postgres..."
	@cd services/postgres && docker compose up -d
	
	@echo "⏳ Waiting for postgres to be ready..."
	@./scripts/wait-for-it.sh localhost:5432 -t 60
	
	@echo "🔄 Setting up database..."
	@$(MAKE) db-setup
	@$(MAKE) db-migrate
	
	@echo "📱 Starting applications..."
	@cd apps/api && docker compose up -d
	@cd apps/web && docker compose up -d
	
	@echo "✅ Development environment is up"

dev-down:
	@echo "🔽 Stopping development environment..."
	@cd apps/web && docker compose down
	@cd apps/api && docker compose down
	@cd services/postgres && docker compose down
	@echo "✅ Development environment stopped"

dev-clean:
	@echo "🧹 Cleaning up development environment..."
	@$(MAKE) web-clean
	@$(MAKE) api-clean
	@echo "✅ Development environment cleaned"

# Helper to check required dependencies
check-dependencies:
	@which docker >/dev/null 2>&1 || (echo "❌ Docker is required but not installed. Aborting." && exit 1)
	@which docker-compose >/dev/null 2>&1 || (echo "❌ Docker Compose is required but not installed. Aborting." && exit 1)

# API Container Management
api-build: check-dependencies
	@echo "🏗️  Building API container..."
	@cd apps/api && DOCKER_BUILDKIT=1 docker build -t insomnia-wallet-api -f Dockerfile ../..
	@echo "✅ API container built"

api-up-build: setup-env api-build services-up-build
	@echo "🚀 Starting API container..."
	@echo "⏳ Waiting for postgres to be ready..."
	@./scripts/wait-for-it.sh localhost:5432 -t 60
	@cd apps/api && docker compose up -d 
	@echo "✅ API container started"
	@echo "🌍 API is available at http://localhost:4000"

api-up: setup-env check-dependencies services-up
	@echo "🚀 Starting API container..."
	@echo "⏳ Waiting for postgres to be ready..."
	@./scripts/wait-for-it.sh localhost:5432 -t 60
	@cd apps/api && docker compose up -d 
	@echo "✅ API container started"
	@echo "🌍 API is available at http://localhost:4000"

api-down:
	@echo "🔽 Stopping API container..."
	@cd apps/api && docker compose down -v
	@echo "✅ API container stopped"
	@$(MAKE) services-down
	

# Display help information
help:
	@echo "🔧 Available commands:"
	@echo "  setup-env          	- Set up environment files from examples"
	@echo "  configure-pgadmin  	- Configure pgAdmin settings"
	@echo "  db-setup          	- Setup database schema"
	@echo "  db-migrate        	- Run database migrations"
	@echo "  db-migrate-dev       	- Run database migrations (dev)"
	@echo "  services-up        	- Start all services"
	@echo "  services-up-build  	- Rebuild and start all services"
	@echo "  services-down      	- Stop all services"
	@echo "  services-clean     	- Stop and clean all services (including volumes)"
	@echo "  api-build         	- Build API container"
	@echo "  api-up-build         	- Build API container and start it (also rebuilds and starts database)"
	@echo "  api-up            	- Start API container (also starts database)"
	@echo "  api-down          	- Stop API container"
	@echo "  dev-up            	- Start complete development environment"
	@echo "  dev-down          	- Stop development environment"
	@echo "  dev-clean         	- Clean up development environment completely"
	@echo "  help              	- Display this help message"