import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import { getSessionSecret, signSession, verifySignature } from "./auth";

describe("auth.ts security fixes", () => {
  const originalEnv = process.env.SESSION_SECRET;

  beforeEach(() => {
    delete process.env.SESSION_SECRET;
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.SESSION_SECRET = originalEnv;
    } else {
      delete process.env.SESSION_SECRET;
    }
  });

  it("throws an error when SESSION_SECRET is not configured", () => {
    assert.throws(
      () => getSessionSecret(),
      (err: Error) => {
        return err.message.includes("SESSION_SECRET environment variable is not configured");
      }
    );

    assert.throws(
      () => signSession("admin:1234567890"),
      (err: Error) => {
        return err.message.includes("SESSION_SECRET environment variable is not configured");
      }
    );

    assert.throws(
      () => verifySignature("admin:1234567890.signature"),
      (err: Error) => {
        return err.message.includes("SESSION_SECRET environment variable is not configured");
      }
    );
  });

  it("works properly when SESSION_SECRET is provided", () => {
    process.env.SESSION_SECRET = "super-secret-test-key-12345";

    const signed = signSession("admin:1234567890");
    assert.ok(signed.startsWith("admin:1234567890."));

    assert.strictEqual(verifySignature(signed), true);
    assert.strictEqual(verifySignature(signed + "invalid"), false);
  });
});
