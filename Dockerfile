FROM node:26-bookworm-slim

ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --chown=node:node bin ./bin
COPY --chown=node:node src ./src

USER node
ENTRYPOINT ["node", "bin/elera-example.mjs"]
