FROM node:18-slim AS builder

WORKDIR /app

RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=api --docker


FROM node:18-slim AS installer

WORKDIR /app

COPY --from=builder /app/out/json .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

COPY --from=builder /app/out/full .
COPY turbo.json ./turbo.json
RUN yarn build --filter=api


FROM node:18-slim AS runner

RUN adduser --system api
USER api

WORKDIR /app

COPY --from=installer --chown=api /app/apps/api .
CMD [ "node", "." ]
