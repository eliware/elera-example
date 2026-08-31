# Source-to-test inventory

Each non-barrel source module is exercised by a focused or composition test
under the matching `tests/` subtree. `index.ts` files are composition modules;
`app.ts` is wiring-only and is exercised through the runtime-entrypoint tests.

| Source | Test | Coverage focus |
| --- | --- | --- |
| `src/configuration/index.ts` | `tests/configuration/index.test.ts` | Configuration |
| `src/configuration/read.ts` | `tests/configuration/read.test.mjs` | Environment configuration parsing |
| `src/lifecycle/index.ts` | `tests/lifecycle/index.test.mjs` | Signal and process-handler registration |
| `src/lifecycle/register.ts` | `tests/lifecycle/register.test.mjs` | Lifecycle registration implementation |
| `src/probe/runner.ts` | `tests/probe/runner.test.ts` | Read/write composition and errors |
| `src/probe/health.ts` | `tests/probe/health.test.mjs` | Health query |
| `src/probe/status.ts` | `tests/probe/status.test.mjs` | Status mapping |
| `src/probe/schema.ts` | `tests/probe/schema.test.mjs` | Table creation |
| `src/probe/write.ts` | `tests/probe/write.test.mjs` | Transactional write |
| `src/probe/readback.ts` | `tests/probe/readback.test.mjs` | Writer readback |
| `src/probe/result-summary.ts` | `tests/probe/result-summary.test.mjs` | Result summary |
| `src/probe/telemetry-state.ts` | `tests/probe/telemetry-state.test.mjs` | State initialization |
| `src/probe/events.ts` | `tests/probe/events.test.mjs` | Success/failure events |
| `src/probe/events/success.ts` | `tests/probe/events/success.test.mjs` | Success event formatting |
| `src/probe/events/failure.ts` | `tests/probe/events/failure.test.mjs` | Failure event formatting |
| `src/probe/telemetry.ts` | `tests/probe/telemetry.test.mjs` | Telemetry lifecycle |
| `src/probe/queries.ts` | `tests/probe/queries.test.mjs` | Probe composition |
| `src/probe/runner.ts` | `tests/probe/runner.test.ts` | Runner composition and errors |
| `src/runtime/index.ts` | `tests/runtime/index.test.mjs` | Startup, scheduling, and cleanup |
| `src/runtime/run.ts` | `tests/runtime/run.test.mjs` | Runtime assembly |
| `src/runtime/startup.ts` | `tests/runtime/startup.test.mjs` | Initial startup/probe |
| `src/runtime/schedule.ts` | `tests/runtime/schedule.test.mjs` | Recurring schedule wiring |
| `src/runtime/client.ts` | `tests/runtime/client.test.mjs` | Public client construction |
| `src/runtime/shutdown.ts` | `tests/runtime/shutdown.test.mjs` | Idempotent cleanup |
| `src/runtime/scheduler/core.ts` | `tests/runtime/scheduler/core.test.mjs` | Active scheduling gate |
| `src/runtime/scheduler/index.ts` | `tests/runtime/scheduler/index.test.mjs` | Interval scheduling |
| `src/probe/index.ts` | `tests/probe/index.test.mjs` | Public barrel/client contract smoke test |

The application is private and is not a published library, so package
`exports` and declaration files are intentionally not provided. Build output
is generated in `dist/` and ignored by Git.
