// Run: node --test server/sendContact.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { sendContact } from "./sendContact.mjs";

const env = { RESEND_API_KEY: "re_test", CONTACT_TO: "me@example.com" };
const valid = { name: "Ada\nInjected", email: "ada@example.com", topic: "Hi", message: "Hello" };

test("rejects missing or malformed fields", async () => {
	assert.equal((await sendContact({}, env)).status, 400);
	assert.equal((await sendContact({ ...valid, email: "nope" }, env)).status, 400);
});

test("honeypot pretends success without sending", async () => {
	assert.deepEqual(await sendContact({ ...valid, website: "bot" }, {}), { status: 200, body: { ok: true } });
});

test("reports missing configuration", async () => {
	assert.equal((await sendContact(valid, {})).status, 503);
});

test("sends through Resend with reply-to and a single-line subject", async () => {
	let sent;
	globalThis.fetch = async (url, init) => ((sent = { url, ...JSON.parse(init.body) }), new Response("{}", { status: 200 }));
	assert.equal((await sendContact(valid, env)).status, 200);
	assert.equal(sent.url, "https://api.resend.com/emails");
	assert.equal(sent.reply_to, "ada@example.com");
	assert.deepEqual(sent.to, ["me@example.com"]);
	assert.ok(!sent.subject.includes("\n"));

	globalThis.fetch = async () => new Response("nope", { status: 422 });
	assert.equal((await sendContact(valid, env)).status, 502);
});
