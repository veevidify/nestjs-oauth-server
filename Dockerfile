FROM node:10.16-alpine as builder

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}


COPY package*.json ./
RUN npm install

FROM node:10.16-alpine

COPY --from=builder node_modules node_modules
RUN npm install -g @nestjs/cli
RUN mkdir -p /app
