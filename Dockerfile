# Build from C:\Users\russe\src so the intentional local Elera package links
# resolve during npm ci:
#   docker build -f elera-example/Dockerfile -t elera-example elera-example/..
FROM node:26-bookworm-slim AS build

WORKDIR /workspace
COPY elera-example/package*.json ./elera-example/
COPY elera-example/ ./elera-example/
COPY elera-client/ ./elera-client/
COPY elera-lib/ ./elera-lib/

WORKDIR /workspace/elera-example
RUN npm ci --ignore-scripts \
  && npm run build \
  && npm prune --omit=dev

FROM node:26-bookworm-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /workspace/elera-example/dist ./dist
COPY --from=build --chown=node:node /workspace/elera-example/node_modules ./node_modules
COPY --from=build --chown=node:node /workspace/elera-example/package.json ./package.json

USER node
ENTRYPOINT ["node", "dist/app.js"]
