FROM node:18-slim AS builder

WORKDIR /app

RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=web --docker


FROM node:18-slim AS installer

WORKDIR /app

COPY --from=builder /app/out/json .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

COPY --from=builder /app/out/full .
COPY turbo.json ./turbo.json
RUN yarn build --filter=web


FROM node:18-slim AS runner

RUN adduser --system web
USER web

WORKDIR /app

COPY --from=installer --chown=web /app/apps/web ./
CMD [ "node", "./.next/standalone/server.js" ]
