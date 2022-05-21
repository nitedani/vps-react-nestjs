FROM node:18-alpine as builder
WORKDIR /src
COPY package*.json ./
RUN npm i --legacy-peer-deps
COPY . ./
ENV NODE_ENV=production
RUN npm run bundle

FROM node:18-alpine
ENV NODE_ENV=production
RUN apk add dumb-init
COPY --from=builder --chown=node:node /src/dist ./dist
EXPOSE 3000
USER node
CMD ["dumb-init", "node", "dist/main.mjs"]
