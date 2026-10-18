import { expect, jest, test } from "@jest/globals";

const createDb = jest.fn();
await jest.unstable_mockModule("@eliware/elera-client", () => ({ createDb }));
const { createExampleClient } = await import("../../src/runtime/client.mjs");

test("maps application configuration to the public client contract", async () => {
  const create = jest.fn().mockResolvedValue("db");
  await expect(createExampleClient({ url: "http://router", token: "token" }, create)).resolves.toBe(
    "db",
  );
  expect(create).toHaveBeenCalledWith({ endpoint: "http://router", token: "token" });
});

test("uses the public client factory by default", async () => {
  createDb.mockResolvedValue("db");
  await expect(createExampleClient({ url: "http://router", token: "token" })).resolves.toBe("db");
  expect(createDb).toHaveBeenCalledWith({ endpoint: "http://router", token: "token" });
});
