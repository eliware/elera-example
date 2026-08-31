# Source-to-test inventory

Each non-barrel source module has a focused test under `tests/` with the
matching module name. `app.ts` is wiring-only and is exercised through the
runtime tests.

| Source | Test | Coverage focus |
| --- | --- | --- |
| `src/configuration.ts` | `tests/configuration.test.ts` | Configuration |
| `src/lifecycle.ts` | `tests/lifecycle.test.mjs` | Signal and process-handler registration |
| `src/probe.ts` | `tests/probe.test.ts` | Read/write probes, transactions, and errors |
| `src/probe-scheduler.ts` | `tests/probe-scheduler.test.mjs` | Scheduling |
| `src/runtime.ts` | `tests/runtime.test.mjs`, `tests/mock-supervisor.test.mjs` | Client startup and cleanup |

The application is private and is not a published library, so package
`exports` and declaration files are intentionally not provided. Build output
is generated in `dist/` and ignored by Git.
