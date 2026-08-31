# `elera-example` alignment drifts

Checklist against the revised Core Flow and applicable repository conventions.
The example is intentionally a small end-user smoke client, not an operator,
supervisor, or lab orchestrator.

## Current status

- [x] The example is limited to the public client package and endpoint/token configuration.
- [x] Runtime-entrypoint coverage, source/test alignment, dependency cleanup, and final gates are verified for the current working tree.

## Actionable drifts

- [x] Remove direct `@eliware/common` and `@eliware/snowflake` dependencies if
  the example source does not import them; the example should depend on the
  client package for Elera behavior and keep its own runtime surface minimal.
- [ ] Replace the temporary `file:../elera-client` dependency with the
  published client package before release packaging.
- [x] Verify the example imports only the public `@eliware/elera-client` API
  and never imports `@eliware/elera-lib`, supervisor internals, CLI modules, or
  lab code.
- [x] Keep required configuration limited to `ELERA_API_ENDPOINT` and
  `ELERA_API_TOKEN`; `ELERA_DEBUG` is explicitly optional local diagnostics.
- [x] Ensure no root token, CLI token, SQL credential, physical database name,
  identity, node address, or cluster setting is required.
- [x] Keep runtime behavior limited to recurring read and write probes plus
  concise telemetry; remove any orchestration, bootstrap, recovery, backup,
  restore, or provisioning behavior.
- [x] Verify read and write probes use separate client operations and that
  writes exercise an auto-increment table for observing writer identity and
  Galera ID spacing.
- [x] Ensure output reports timestamp, operation, observed database nodes,
  latency, and errors without becoming log-spammy; routing, retry, reconnect,
  and bundle details remain client-owned internals in the DbPool contract.
- [x] Add explicit runtime-entrypoint coverage with the same environment and
  public dependency shape as a real consuming application.
- [ ] Add client-contract failure-path coverage for drain, shutdown, unavailable, reconnect,
  expired-bundle, and cluster-unavailable states.
- [x] Create or regenerate a source-to-test inventory and mirror every
  non-barrel source module under the matching test path.
- [x] Remove non-barrel Istanbul ignores and verify the example’s in-scope
  coverage gate.
- [x] Run build, tests, lint, check, audit, and package checks after the
  dependency and boundary cleanup.
- [x] Reconcile README, Core Flow contract, package metadata, and lockfile
  after the final dependency boundary is established.

## Verified or intentional boundaries

- [x] The example uses `@eliware/elera-client` for managed database access.
- [x] It does not perform cluster orchestration or operator workflows.
- [x] It follows the endpoint/token application configuration model.
- [x] It is separate from the Docker lab and does not start lab containers.
