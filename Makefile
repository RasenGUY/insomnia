SHELL := /bin/bash
.PHONY: services-up services-up-build services-down services-clean up up-build down clean setup-env-local setup-env-docker check-dependencies configure-pgadmin db-setup db-migrate 

# Helper to check required dependencies
check-dependencies:
	@which docker >/dev/null 2>&1 || (echo "❌ Docker is required but not installed. Aborting." && exit 1)
	@which docker-compose >/dev/null 2>&1 || (echo "❌ Docker Compose is required but not installed. Aborting." && exit 1)

# Environment Setup for running in docker
setup-env-local:
	@echo "🔧 Setting up environment files..."
	@test -f ./apps/api/.env || cp ./apps/api/.env.example ./apps/api/.env 
	@test -f ./apps/web/.env || cp ./apps/web/.env.example ./apps/web/.env
	@echo "✅ Environment files setup complete"

setup-env-docker:
	@echo "🔧 Setting up environment files..."
	@test -f ./services/postgres/.env.docker || cp ./services/postgres/.env.docker.example ./services/postgres/.env.docker
	@test -f ./apps/api/.env.docker || cp ./apps/api/.env.docker.example ./apps/api/.env.docker
	@test -f ./apps/web/.env.docker || cp ./apps/web/.env.docker.example ./apps/web/.env.docker
	@echo "✅ Environment files setup complete"

# Configure PgAdmin
configure-pgadmin:
	@echo "🔧 Configuring pgAdmin..."
	@if [ ! -f "$(./services/postgres/.env.docker)" ]; then \
		echo "❌ Postgres environment file not found. Running setup-env first..."; \
		$(MAKE) setup-env; \
	fi
	@echo '{"Servers":{"1":{"Name":"Insomnia DB","Group":"Servers","Host":"${HOST}","Port":5432,"MaintenanceDB":"$(POSTGRES_DB)","Username":"$(POSTGRES_USER)","SSLMode":"prefer","PassFile":"/pgpass"}}}' > services/postgres/pgadmin_init.json 
	@echo "${HOST}:5432:$(POSTGRES_DB):$(POSTGRES_USER):$(POSTGRES_PASSWORD)" > services/postgres/.pgpass
	@chmod 600 services/postgres/.pgpass
	@echo "✅ pgAdmin configuration completed using variables from $(./services/postgres/.env.docker)"

# Services Management
services-up: check-dependencies setup-env configure-pgadmin
	@echo "🚀 Starting services..."
	@cd services/postgres && docker compose up -d
	@echo "✅ Services started"

services-up-build: check-dependencies setup-env configure-pgadmin
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
	@cd services/postgres && rm -f .pgpass pgadmin_init.json 2>/dev/null || true
	@docker network rm insomnia-wallet-network 2>/dev/null || true
	@echo "✅ Services cleaned"

# Api Management	
up-build: setup-env services-up-build 
	@echo "🚀 Starting API container..."
	@echo "⏳ Waiting for postgres to be ready..."
	@./scripts/wait-for-it.sh localhost:5432 -t 60
	@cd apps/api && docker compose up -d --build 
	@cd apps/web && docker compose up -d --build 
	@echo "✅ API container started"
	@echo "🌍 API is available at http://localhost:4000"

up: services-up
	@echo "🚀 Starting API container..."
	@echo "⏳ Waiting for postgres to be ready..."
	@./scripts/wait-for-it.sh localhost:5432 -t 60
	@cd apps/api && docker compose up -d 
	@cd apps/web && docker compose up -d 
	@echo "✅ API container started"
	@echo "🌍 API is available at http://localhost:4000"

down:
	@echo "🔽 Stopping API container..."
	@cd apps/api && docker compose down
	@cd apps/web && docker compose down
	@echo "✅ API container stopped"
	@$(MAKE) services-down

clean:
	@echo "🧹 Cleaning up api and services..."
	@cd apps/api && docker compose down -v
	@cd apps/web && docker compose down -v
	@echo "✅ API container stopped"
	@$(MAKE) services-clean

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

# Display help information
help:
	@echo "🔧 Available commands:"
	@echo "  setup-env-docker      - Set up environment files from docker examples"
	@echo "  setup-env-local       - Set up environment files from examples"
	@echo "  configure-pgadmin  	- Configure pgAdmin settings"
	@echo "  db-setup          	- Setup database schema"
	@echo "  db-migrate        	- Run database migrations"
	@echo "  db-migrate-dev       	- Run database migrations (dev)"
	@echo "  services-up        	- Start all services"
	@echo "  services-up-build  	- Rebuild and start all services"
	@echo "  services-down      	- Stop all services"
	@echo "  services-clean     	- Stop and clean all services (including volumes)"
	@echo "  up-build         	- Build API container and start it (also rebuilds and starts database)"
	@echo "  up            	- Start API container (also starts database)"
	@echo "  down          	- Stop API container"
	@echo "  clean         	- Clean up development environment completely"
	@echo "  help              	- Display this help message"
