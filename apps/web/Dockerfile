FROM node:20-alpine AS base

RUN npm install -g pnpm@9.12.3

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

COPY apps/web/package.json apps/web/
COPY packages/ui/package.json packages/ui/
COPY packages/typescript-config/package.json packages/typescript-config/
COPY packages/eslint-config/package.json packages/eslint-config/

RUN pnpm install --frozen-lockfile

COPY ./turbo.json ./
COPY ./tsconfig.json ./ 

COPY packages/ui/tsconfig.json packages/ui/
COPY packages/ui/components.json packages/ui/components.json 
COPY packages/ui/src packages/ui/src/
COPY packages/ui/postcss.config.mjs packages/ui/
COPY packages/ui/tailwind.config.ts packages/ui/
COPY packages/typescript-config packages/typescript-config/
COPY packages/eslint-config packages/eslint-config/

COPY apps/web/components.json apps/web/
COPY apps/web/next.config.mjs apps/web/
COPY apps/web/next-env.d.ts apps/web/
COPY apps/web/tsconfig.json apps/web/
COPY apps/web/tailwind.config.ts apps/web/ 
COPY apps/web/postcss.config.mjs apps/web/ 
COPY apps/web/app apps/web/app/
COPY apps/web/components apps/web/components/ 
COPY apps/web/config apps/web/config/ 
COPY apps/web/lib apps/web/lib/
COPY apps/web/hooks apps/web/hooks/
COPY apps/web/public apps/web/public/
COPY apps/web/server apps/web/server/ 
COPY apps/web/types apps/web/types/  
COPY apps/web/utils apps/web/utils/   
COPY apps/web/docker-entrypoint.sh apps/web/

WORKDIR /app/apps/web

RUN pnpm build

FROM node:20-alpine AS main

RUN npm install -g pnpm@9.12.3

WORKDIR /app

COPY --from=base /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --from=base /app/apps/web/package.json /app/apps/web/
COPY --from=base /app/packages /app/packages

RUN pnpm install --frozen-lockfile

COPY --from=base /app/apps/web/.next /app/apps/web/.next
COPY --from=base /app/apps/web/docker-entrypoint.sh /app/apps/web/docker-entrypoint.sh

EXPOSE 3000

WORKDIR /app/apps/web

RUN chmod +x ./docker-entrypoint.sh

CMD ["/bin/sh", "./docker-entrypoint.sh"]