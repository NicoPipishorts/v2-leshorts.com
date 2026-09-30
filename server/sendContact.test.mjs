// Run: node --test server/sendContact.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { sendContact } from "./sendContact.mjs";

const env = { RESEND_API_KEY: "re_test", CONTACT_TO: "me@example.com" };
const valid = { name: "Ada\nLovelace", email: "ada@example.com", topic: "Hi", message: "Hello <script>x</script>", lang: "fr" };

/** Stub fetch: records Resend calls, answers siteverify, lets a test fail a given Resend call. */
const stub = ({ captcha = true, failResend = [] } = {}) => {
	const mails = [];
	globalThis.fetch = async (url, init) => {
		if (url.includes("siteverify")) return Response.json({ success: captcha });
		mails.push(JSON.parse(init.body));
		return failResend.includes(mails.length) ? new Response("nope", { status: 422 }) : new Response("{}", { status: 200 });
	};
	return mails;
};

test("rejects missing or malformed fields", async () => {
	assert.equal((await sendContact({}, env)).status, 400);
	assert.equal((await sendContact({ ...valid, email: "nope" }, env)).status, 400);
});

test("honeypot pretends success without sending", async () => {
	const mails = stub();
	assert.deepEqual(await sendContact({ ...valid, website: "bot" }, env), { status: 200, body: { ok: true } });
	assert.equal(mails.length, 0);
});

test("reports missing configuration", async () => {
	assert.equal((await sendContact(valid, {})).status, 503);
});

test("sends a notification to Nicolas and a localized confirmation to the visitor", async () => {
	const mails = stub();
	assert.equal((await sendContact(valid, env)).status, 200);
	const [note, confirm] = mails;

	assert.deepEqual(note.to, ["me@example.com"]);
	assert.equal(note.reply_to, "ada@example.com");
	assert.ok(!note.subject.includes("\n"));
	assert.ok(note.html.includes("&lt;script&gt;") && !note.html.includes("<script>"), "visitor input is escaped");

	assert.deepEqual(confirm.to, ["ada@example.com"]);
	assert.equal(confirm.reply_to, "me@example.com");
	assert.match(confirm.subject, /^Merci pour votre message, Ada$/);
	assert.ok(!confirm.html.includes("Hello") && !confirm.text.includes("Hello"), "confirmation never echoes the message");
});

test("notification failure is an error; confirmation failure is not", async () => {
	stub({ failResend: [1] });
	assert.equal((await sendContact(valid, env)).status, 502);
	stub({ failResend: [2] });
	assert.equal((await sendContact(valid, env)).status, 200);
});

test("with a Turnstile secret, messages need a token Cloudflare accepts", async () => {
	const withCaptcha = { ...env, TURNSTILE_SECRET_KEY: "secret" };
	let mails = stub({ captcha: false });
	assert.equal((await sendContact(valid, withCaptcha)).status, 403); // no token
	assert.equal((await sendContact({ ...valid, token: "t" }, withCaptcha)).status, 403); // rejected
	assert.equal(mails.length, 0);

	mails = stub({ captcha: true });
	assert.equal((await sendContact({ ...valid, token: "t" }, withCaptcha, "1.2.3.4")).status, 200);
	assert.equal(mails.length, 2);
});
