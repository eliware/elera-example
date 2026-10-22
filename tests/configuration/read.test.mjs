import { expect, test } from "@jest/globals";
import { readConfiguration } from "../../src/configuration/read.mjs";

test("reads the documented endpoint and token contract", () => {
  expect(
    readConfiguration({
      ELERA_API_URL: "http://router",
      ELERA_API_TOKEN: "token",
    }),
  ).toEqual({ url: "http://router", token: "token" });
});

test("reads the process environment", () => {
  const endpoint = process.env.ELERA_API_URL;
  const token = process.env.ELERA_API_TOKEN;
  process.env.ELERA_API_URL = "http://router";
  process.env.ELERA_API_TOKEN = "token";

  try {
    expect(readConfiguration()).toEqual({ url: "http://router", token: "token" });
  } finally {
    if (endpoint === undefined) delete process.env.ELERA_API_URL;
    else process.env.ELERA_API_URL = endpoint;
    if (token === undefined) delete process.env.ELERA_API_TOKEN;
    else process.env.ELERA_API_TOKEN = token;
  }
});

test("reports missing endpoint and token values", () => {
  expect(() => readConfiguration({})).toThrow("sample app requires: url, token");
});
