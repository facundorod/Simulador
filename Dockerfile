# Stage 1: Build
FROM node:16.20.0-alpine3.18 as build

WORKDIR /usr/src/app


COPY package*.json ./

RUN npm config set legacy-peer-deps true && npm i

COPY . .

RUN npm run build:prod

# Stage 2: Serve
FROM nginx:alpine

COPY --from=build /usr/src/app/dist/FrontEnd /usr/share/nginx/html

EXPOSE 80
