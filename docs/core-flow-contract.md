# Core-flow contract

This repository is a deliberately small end-user example, not an
orchestration tool. It demonstrates how an application consumes Elera.

## Configuration

The application accepts only `ELERA_API_ENDPOINT` and `ELERA_API_TOKEN`.
The token identifies the application, database, identity, and scopes. The app
does not configure SQL credentials, application names, identities, nodes, or
cluster settings.

## Runtime behavior

The example uses the public `@eliware/elera-client` package, obtains its
routing bundle through the client, and runs simple read/write probes. It may
report routing and telemetry observations, but it does not provision resources,
bootstrap Galera, drain nodes, perform recovery, or invoke CLI workflows.

The bundle and event semantics are those defined by the supervisor contract:
resolved resource identity, credentials, writer, readers, ordered failover,
version, expiry, node identity, and ports.
