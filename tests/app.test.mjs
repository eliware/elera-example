import { expect, jest, test } from "@jest/globals";

const configuration = { url: "http://router", token: "token" };
const shutdown = jest.fn();
const readConfiguration = jest.fn(() => configuration);
const runExample = jest.fn().mockResolvedValue(shutdown);
const registerExampleLifecycle = jest.fn();
const info = jest.fn();

await jest.unstable_mockModule("../src/configuration/read.mjs", () => ({ readConfiguration }));
await jest.unstable_mockModule("../src/runtime/run.mjs", () => ({ runExample }));
await jest.unstable_mockModule("../src/lifecycle/register.mjs", () => ({
  registerExampleLifecycle,
}));
await jest.unstable_mockModule("@eliware/common", () => ({ log: { info } }));

test("starts the configured runtime and registers lifecycle handlers", async () => {
  await import("../src/app.mjs");
  expect(readConfiguration).toHaveBeenCalledTimes(1);
  expect(runExample).toHaveBeenCalledWith(configuration);
  expect(registerExampleLifecycle).toHaveBeenCalledWith(shutdown);
  expect(info).toHaveBeenCalledWith("Elera example client is running");
});
