# @eliware/elera-example

Runnable client example for `@eliware/elera-lib`. It obtains a routing bundle
from an Elera supervisor, maintains the routing WebSocket, runs a read/write
SQL probe once per second, and emits concise routing and telemetry events.

## Setup

```text
copy .env.example .env
npm ci
npm run build
node dist/app.js
```

Set only `ELERA_API_ENDPOINT` and `ELERA_API_TOKEN` in the local environment.
The token must be application-scoped; never use a root token in this client.
The token determines the application, database, and credential context.
`ELERA_DEBUG=1` enables diagnostic output.

The client identity is generated internally with `@eliware/snowflake`; it is
not an environment variable and must not be supplied by the application.

The example creates and writes `sample_app.e2e_probe`. Its generated IDs and
reported writer host make writer assignment and failover observable. It exits
cleanly on `SIGTERM` and `SIGINT`, closing the routing stream and SQL pool.

## Validation

```text
npm test
npm run lint
npm run check
npm run audit
```

This repository intentionally contains no Docker, Kubernetes, supervisor, or
GitOps configuration. Those integrations consume this example from their own
test harnesses.
