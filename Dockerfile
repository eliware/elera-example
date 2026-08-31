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
# Copy local file: dependencies into node_modules so the runtime stage does not
# depend on the build workspace's paths or symlinks.
RUN rm -rf node_modules dist \
  && npm install --ignore-scripts --install-links=true \
  && npm run build \
  && npm prune --omit=dev \
  && rm -rf node_modules/@eliware/elera-client node_modules/@eliware/elera-lib \
  && cp -R /workspace/elera-client node_modules/@eliware/elera-client \
  && cp -R /workspace/elera-lib node_modules/@eliware/elera-lib

FROM node:26-bookworm-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /workspace/elera-example/dist ./dist
COPY --from=build --chown=node:node /workspace/elera-example/node_modules ./node_modules
COPY --from=build --chown=node:node /workspace/elera-example/package.json ./package.json

USER node
ENTRYPOINT ["node", "dist/app.js"]
