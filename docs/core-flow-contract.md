# Core flow contract

This repository contains a small client example. It shows how an application uses Elera.

## Configuration

The application requires `ELERA_API_URL` and `ELERA_API_TOKEN`.
The token needs read and write access for the example's recurring work.
The application does not set SQL credentials, names, identities, nodes, or cluster options.

## Runtime behavior

The example uses the public `@eliware/elera-client` package.
It checks client health, reads status and schema data, and writes one row in a transaction.
It reads the row to identify the writer node.
It starts a recurring run after the first run ends.
A failed run emits `sql.error`, so later runs can check the state again.
Shutdown calls `end` once and reports close errors.

The runtime enters the stopping state before it closes the client.
If close fails, a later shutdown call does not try again.
The example reports query results, timing, database nodes, and errors.
It does not create resources, bootstrap Galera, drain nodes, restore resources, or run CLI actions.

Routing, credentials, failover, and lifecycle events stay inside the client package.
The application receives the mysql2-compatible client surface.
