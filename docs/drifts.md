# `elera-example` alignment drifts

Checklist against the revised Core Flow and applicable repository conventions.
The example is intentionally a small end-user smoke client, not an operator,
supervisor, or lab orchestrator.

## Current status

- [x] The example is limited to the public client package and endpoint/token configuration.
- [ ] Runtime-entrypoint/failure coverage, source/test alignment, dependency cleanup, and final gates remain open.

## Actionable drifts

- [ ] Remove direct `@eliware/common` and `@eliware/snowflake` dependencies if
  the example source does not import them; the example should depend on the
  client package for Elera behavior and keep its own runtime surface minimal.
- [ ] Replace the temporary `file:../elera-client` dependency with the
  published client package before release packaging.
- [ ] Verify the example imports only the public `@eliware/elera-client` API
  and never imports `@eliware/elera-lib`, supervisor internals, CLI modules, or
  lab code.
- [ ] Keep required configuration limited to `ELERA_API_ENDPOINT` and
  `ELERA_API_TOKEN`; `ELERA_DEBUG` may remain optional diagnostics.
- [ ] Ensure no root token, CLI token, SQL credential, physical database name,
  identity, node address, or cluster setting is required.
- [ ] Keep runtime behavior limited to recurring read and write probes plus
  concise telemetry; remove any orchestration, bootstrap, recovery, backup,
  restore, or provisioning behavior.
- [ ] Verify read and write probes use separate client operations and that
  writes exercise an auto-increment table for observing writer identity and
  Galera ID spacing.
- [ ] Ensure output reports timestamp, operation, selected route, writer/read
  node, latency, errors, retries, reconnects, failover changes, and bundle
  version without becoming log-spammy.
- [ ] Add explicit runtime-entrypoint coverage with the same environment and
  public dependency shape as a real consuming application.
- [ ] Add failure-path coverage for drain, shutdown, unavailable, reconnect,
  expired-bundle, and cluster-unavailable states.
- [ ] Create or regenerate a source-to-test inventory and mirror every
  non-barrel source module under the matching test path.
- [ ] Remove non-barrel Istanbul ignores and verify the example’s in-scope
  coverage gate.
- [ ] Run build, tests, lint, typecheck, audit, and package checks after the
  dependency and boundary cleanup.
- [ ] Reconcile README, Core Flow contract, package metadata, and lockfile
  after the final dependency boundary is established.

## Verified or intentional boundaries

- [x] The example uses `@eliware/elera-client` for managed database access.
- [x] It does not perform cluster orchestration or operator workflows.
- [x] It follows the endpoint/token application configuration model.
- [x] It is separate from the Docker lab and does not start lab containers.
