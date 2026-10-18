# Current notes

Compare this example with the Core Flow contract and repository rules.
Record future changes here with an action.

## Scope

- The example uses the public `@eliware/elera-client` API.
- The application requires the endpoint and token values.
- The application uses `ELERA_DEBUG` only for local diagnostics.
- The application runs recurring read and write work with short telemetry.
- The application does not run operator, lab, bootstrap, recovery, or provisioning tasks.
- The Docker lab remains separate from this example.

## Dependency boundary

- The source imports `@eliware/common` for logs and lifecycle handlers.
- The source imports `@eliware/elera-client` for database access.
- The package does not import `@eliware/snowflake` or `@eliware/elera-lib`.
- The client owns routing, retries, reconnects, and bundle details.

## Validation record

- The source uses the public client surface.
- The runtime reports failures through `sql.error` telemetry.
- The package metadata and dependency lock must match before release.
- Run the build, tests, lint, type check, audit, and package checks before release.
