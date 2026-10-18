import { expect, test } from "@jest/globals";
import { readConfiguration } from "../../src/configuration/read.mjs";

test("reads the documented endpoint and token contract", () => {
  expect(
    readConfiguration({
      ELERA_API_URL: "http://router",
      ELERA_API_TOKEN: "token",
      ELERA_DEBUG: "1",
    }),
  ).toEqual({ url: "http://router", token: "token", debug: true });
});

test("reads the process environment and defaults diagnostics to off", () => {
  const endpoint = process.env.ELERA_API_URL;
  const token = process.env.ELERA_API_TOKEN;
  const debug = process.env.ELERA_DEBUG;
  process.env.ELERA_API_URL = "http://router";
  process.env.ELERA_API_TOKEN = "token";
  delete process.env.ELERA_DEBUG;

  try {
    expect(readConfiguration()).toEqual({ url: "http://router", token: "token", debug: false });
  } finally {
    if (endpoint === undefined) delete process.env.ELERA_API_URL;
    else process.env.ELERA_API_URL = endpoint;
    if (token === undefined) delete process.env.ELERA_API_TOKEN;
    else process.env.ELERA_API_TOKEN = token;
    if (debug === undefined) delete process.env.ELERA_DEBUG;
    else process.env.ELERA_DEBUG = debug;
  }
});

test("reports missing endpoint and token values", () => {
  expect(() => readConfiguration({})).toThrow("sample app requires: url, token");
});
