# Agent guidance

Use Node.js 26 and native ESM. Keep the example entrypoint thin and behavior
in focused modules. Use `@eliware/elera-lib` for routing and SQL access; do
not add supervisor, CLI, Docker, or GitOps behavior to this repository.

Tests belong under `tests/` and should mirror `src/`. Use `@eliware/test` and
keep the example safe: credentials are supplied only through environment
variables and never committed.
