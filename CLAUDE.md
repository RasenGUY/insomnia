# Common Commands

## Build/Test/Lint Commands
- **Web**: `cd apps/web && pnpm dev` (Next.js with Turbopack)
- **API**: `cd apps/api && pnpm start:dev` (NestJS)
- **Lint**: `turbo lint` (all packages) or `cd apps/{web|api} && pnpm lint`
- **Build**: `turbo build` (all packages) or `cd apps/{web|api} && pnpm build`
- **API Tests**: `cd apps/api && pnpm test` or `pnpm test:watch`
- **Run single test**: `cd apps/api && pnpm test -- -t "test name pattern"`
- **Database**: `cd apps/api && pnpm prisma:dev:deploy` (apply migrations)

## Code Style Guidelines
- **TypeScript**: Strict mode enabled with explicit return types
- **Imports**: Group imports by external/internal, alphabetize
- **Components**: React functional components with explicit type definitions
- **State Management**: Use React hooks and context where appropriate
- **Error Handling**: Use try/catch with specific error typing
- **API Responses**: Follow common response patterns (apps/api/src/common/responses)
- **NestJS**: Injectable services, controller route handlers with explicit DTOs
- **Next.js**: Page components in app directory with specific routing conventions
- **Naming**: PascalCase for components/types, camelCase for variables/functions
- **Formatting**: Default Prettier settings with 2-space indentation
- **General**: Follow clean code principles and best practices