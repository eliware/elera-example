import { jest, test } from "@jest/globals";
import { registerExampleLifecycle } from "../../src/lifecycle/register.mjs";

test("registers lifecycle handling and exposes removal", () => {
  const lifecycle = registerExampleLifecycle(jest.fn(async () => undefined));
  lifecycle.remove();
});
