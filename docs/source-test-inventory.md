# Source and test inventory

The source modules live in `src/`.
The Jest test modules live in `tests/` and import source modules from `src/`.
The tests cover configuration, lifecycle handlers, database work, telemetry, and runtime flow.

`src/app.mjs` wires the runtime and registers process handlers.
Use the [testing guide](../README.md#testing) to run the full validation suite.
