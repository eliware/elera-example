# Core-flow contract

This repository is a deliberately small end-user example, not an
orchestration tool. It demonstrates how an application consumes Elera.

## Configuration

The application requires `ELERA_API_ENDPOINT` and `ELERA_API_TOKEN`. The
optional `ELERA_DEBUG=1` flag enables local diagnostics only; it is not part of
the Elera connection contract. The runtime token identifies the application,
database, identity, and scopes, and this example requires read and write scope
for its recurring probe. The app does not configure SQL credentials,
application names, identities, nodes, or cluster settings.

## Runtime behavior

The example uses the public `@eliware/elera-client` package and its
mysql2-compatible `execute`, `getConnection`, connection transaction methods,
and `end` lifecycle method to run simple read/write probes. Its telemetry is
limited to query results, timing, observed database nodes, and errors.
Shutdown is idempotent. It may report probe observations, but it does not
provision resources,
bootstrap Galera, drain nodes, perform recovery, or invoke CLI workflows.

Routing, credentials, failover, and lifecycle events remain client internals;
the application receives only the mysql2-compatible client surface.
