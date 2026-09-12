import test from "node:test";
import assert from "node:assert/strict";
import {
  emailDraft,
  formEndpoint,
  validateFeedback,
  submitFeedback,
} from "../src/feedback-core.js";

const note = {
  category: "suggestion",
  message: "I enjoyed exploring the studio.",
  name: "Visitor",
  email: "visitor@example.com",
};
test("validates messages without requiring identity", () => {
  assert.ok(validateFeedback({ ...note, name: "", email: "" }).data);
  for (const bad of [
    { message: "   " },
    { message: "x".repeat(3001) },
    { email: "broken" },
    { category: "unknown" },
    { _gotcha: "bot" },
  ]) {
    assert.ok(validateFeedback({ ...note, ...bad }).error);
  }
});
test("only accepts public Formspree form IDs", () => {
  assert.equal(formEndpoint("abcdefgh"), "https://formspree.io/f/abcdefgh");
  for (const id of [
    "",
    undefined,
    "https://evil.example",
    "../../endpoint",
    "secret_with_underscores",
  ])
    assert.equal(formEndpoint(id), null);
});
test("email drafts encode user content without altering recipients or headers", () => {
  const draft = emailDraft(
    { ...note, message: "A & B? #1\n<script>alert(1)</script>" },
    "ashah45@ncsu.edu",
  );
  assert.equal(draft.url.split("?")[0], "mailto:ashah45@ncsu.edu");
  const params = new URLSearchParams(draft.url.split("?")[1]);
  assert.match(params.get("body"), /A & B\? #1/);
  assert.equal(params.get("bcc"), null);
});
test("submits JSON and reports success only for successful responses", async () => {
  let captured;
  await submitFeedback("https://formspree.io/f/abcdefgh", note, {
    fetchFn: async (url, options) => {
      captured = { url, options };
      return { ok: true, status: 200 };
    },
  });
  assert.equal(JSON.parse(captured.options.body).message, note.message);
  assert.equal(captured.options.method, "POST");
  for (const status of [400, 403, 429, 500]) {
    await assert.rejects(
      submitFeedback("test", note, {
        fetchFn: async () => ({ ok: false, status }),
      }),
    );
  }
});
test("network errors and aborts give actionable errors", async () => {
  await assert.rejects(
    submitFeedback("test", note, {
      fetchFn: async () => {
        throw new TypeError("Failed to fetch");
      },
    }),
    /Unable to connect/,
  );
  await assert.rejects(
    submitFeedback("test", note, {
      timeoutMs: 5,
      fetchFn: (_, { signal }) =>
        new Promise((_, reject) =>
          signal.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          ),
        ),
    }),
    /timed out/,
  );
});
