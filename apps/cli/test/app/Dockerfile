FROM node:18 AS node_modules

WORKDIR /app
COPY package*.json ./
RUN npm install


FROM node:18 AS build

WORKDIR /app
COPY --from=node_modules /app/node_modules ./node_modules
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm run build


FROM node:18

WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/package*.json ./

EXPOSE 3000
CMD npm run start
