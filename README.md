# @eliware/elera-example

Runnable client example for `@eliware/elera-client`. It uses the client’s
mysql2-compatible pool API, runs a read/write SQL probe once per second, and
emits concise probe events.

## Setup

```text
copy .env.example .env
npm ci
npm run build
node dist/app.js
```

Set `ELERA_API_URL` and `ELERA_API_TOKEN` in the local environment.
The recurring read/write probe requires a runtime token with
`database:read` and `database:write` scope. The token must be
application-scoped; never use a root token in this client.
The token determines the application, database, and credential context.
Optionally set `ELERA_DEBUG=1` for local diagnostic output; it is not an Elera
connection setting or credential.

The example creates and writes `sample_app.e2e_probe`. Its generated IDs and
reported database nodes make the write path observable. It uses `execute()`
for queries, an acquired connection with begin/commit/rollback/release for the
write transaction, and `end()` for shutdown. It exits cleanly on `SIGTERM` and
`SIGINT`; shutdown is idempotent and ends the managed client once.

## Validation

```text
npm test
npm run lint
npm run check
npm run audit
```

## Container

Build from the parent source directory while the client and shared library
remain local linked dependencies:

```text
docker build -f elera-example/Dockerfile -t elera-example elera-example/..
docker run --rm --env-file elera-example/.env elera-example
```

The image runs the compiled app as the non-root `node` user. It contains no
credentials; provide the endpoint and token at runtime.

## Operations

This is a runnable client example, not a network service. It has no listening
port or separate health/readiness endpoint; use the client probe output and
process exit status for local validation. Logs are concise structured events
written to standard output, and `ELERA_DEBUG=1` enables optional diagnostics.

Deployment, backups, rollback, and runtime secret management belong to the
consuming application's environment. This repository has no container or
Kubernetes deployment; its Knit validation commands are the source of truth
for repository synchronization.

This repository intentionally contains no Docker, Kubernetes, supervisor, or
GitOps configuration. Those integrations consume this example from their own
test harnesses.
