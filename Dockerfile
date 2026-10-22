# Use the parent source directory so the local Elera packages resolve:
#   docker build -f elera-example/Dockerfile -t elera-example elera-example/..
FROM node:26-bookworm-slim AS dependencies

WORKDIR /workspace
COPY elera-example/package*.json ./elera-example/
COPY elera-example/ ./elera-example/
COPY elera-client/ ./elera-client/
COPY elera-lib/ ./elera-lib/

WORKDIR /workspace/elera-example
# Copy local file dependencies into node_modules so the runtime stage does not
# depend on workspace paths or symlinks.
RUN rm -rf node_modules \
  && npm install --ignore-scripts --install-links=true \
  && npm prune --omit=dev \
  && rm -rf node_modules/@eliware/elera-client node_modules/@eliware/elera-lib \
  && cp -R /workspace/elera-client node_modules/@eliware/elera-client \
  && cp -R /workspace/elera-lib node_modules/@eliware/elera-lib

FROM node:26-bookworm-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app
COPY --from=dependencies --chown=node:node /workspace/elera-example/node_modules ./node_modules
COPY --chown=node:node package.json ./package.json
COPY --chown=node:node bin ./bin
COPY --chown=node:node src ./src

USER node
ENTRYPOINT ["node", "bin/elera-example.mjs"]
