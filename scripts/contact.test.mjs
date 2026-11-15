import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { isSameOrigin } from "../src/lib/request-origin.ts";
import { readLimitedBody } from "../src/lib/request-body.ts";

const source = readFileSync(new URL("../src/app/api/contact/route.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
const textSource = readFileSync(new URL("../src/lib/contact-text.ts", import.meta.url), "utf8");
const textCompiled = ts.transpileModule(textSource, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const textModule = { exports: {} };
vm.runInNewContext(textCompiled, { module: textModule, exports: textModule.exports });
const realRequire = createRequire(import.meta.url);
const config = {
  CONTACT_SMTP_HOST: "smtp.example.test", CONTACT_SMTP_PORT: "465", CONTACT_SMTP_USER: "school",
  CONTACT_SMTP_PASSWORD: "test", CONTACT_FROM: "school@example.test", CONTACT_TO: "school@example.test",
  NEXT_PUBLIC_HCAPTCHA_SITEKEY: "public-site-key", HCAPTCHA_SECRET: "server-secret",
};

function setup({ env = config, limit = true, limitError = null, accepted = ["school@example.test"], rejected = [], sendError = null, confirmationAccepted = ["sender@example.test"], confirmationRejected = [], confirmationError = null, captcha = { success: true }, captchaStatus = 200, captchaError = null } = {}) {
  const calls = { reservations: 0, mail: [], options: null, closed: 0, verifications: [], errors: [] };
  const modules = {
    nodemailer: { createTransport(options) {
      calls.options = options;
      return {
        async sendMail(mail) {
          calls.mail.push(mail);
          if (calls.mail.length === 1) {
            if (sendError) throw sendError;
            return { accepted, rejected };
          }
          if (confirmationError) throw confirmationError;
          return { accepted: confirmationAccepted, rejected: confirmationRejected };
        },
        close() { calls.closed++; },
      };
    } },
    "next/server": { NextResponse: { json: (body, options) => Response.json(body, options) } },
    "@/lib/news-engagement": { engagementClient: () => ({ async rpc() { calls.reservations++; return { data: limit, error: limitError }; } }) },
    "@/lib/request-origin": { isSameOrigin },
    "@/lib/request-body": { readLimitedBody },
    "@/lib/contact-text": textModule.exports,
  };
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, {
    module: testModule, exports: testModule.exports, require: (id) => modules[id] ?? realRequire(id),
    process: { env }, Buffer, console: { error(...args) { calls.errors.push(args); } },
    URLSearchParams, AbortSignal,
    fetch: async (url, options) => {
      calls.verifications.push({ url, options });
      if (captchaError) throw captchaError;
      return Response.json(captcha, { status: captchaStatus });
    },
  });
  return { post: testModule.exports.POST, calls };
}

function request(body, origin = "http://localhost:3000") {
  const url = "http://localhost:3000/api/contact";
  const result = new Request(url, { method: "POST", headers: { "content-type": "application/json", origin }, body: typeof body === "string" ? body : JSON.stringify(body) });
  result.nextUrl = new URL(url);
  return result;
}

const valid = { name: "Тест", email: "sender@example.test", phone: "+381 60 123 4567", subject: "Упис", message: "Пробна порука", captchaToken: "test-token" };

test("valid messages use TLS, reply to the sender and report accepted delivery", async () => {
  const { post, calls } = setup();
  const response = await post(request(valid));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, confirmationAccepted: true });
  assert.equal(calls.reservations, 1);
  assert.equal(calls.verifications[0].url, "https://api.hcaptcha.com/siteverify");
  assert.equal(calls.verifications[0].options.body.get("sitekey"), config.NEXT_PUBLIC_HCAPTCHA_SITEKEY);
  assert.equal(calls.verifications[0].options.body.get("response"), valid.captchaToken);
  assert.equal(calls.options.secure, true);
  assert.equal(calls.options.requireTLS, true);
  assert.equal(calls.mail[0].to, config.CONTACT_TO);
  assert.equal(calls.mail[0].replyTo, valid.email);
  assert.match(calls.mail[0].text, /Пробна порука/);
  assert.match(calls.mail[0].text, /Телефон: \+381 60 123 4567/);
  assert.match(calls.mail[0].subject, /Упис/);
  assert.match(calls.mail[0].html, /Контакт форма/);
  assert.match(calls.mail[0].html, /Пробна порука/);
  assert.equal(calls.mail.length, 2);
  assert.equal(calls.mail[1].to, valid.email);
  assert.equal(calls.mail[1].from, config.CONTACT_FROM);
  assert.equal(calls.mail[1].replyTo, config.CONTACT_TO);
  assert.equal(calls.mail[1].headers["Auto-Submitted"], "auto-replied");
  assert.equal(calls.mail[1].headers["X-Auto-Response-Suppress"], "All");
  assert.match(calls.mail[1].html, /Хвала што сте нам писали/);
  assert.match(calls.mail[1].text, /Школа ће прегледати вашу поруку/);
  assert.doesNotMatch(calls.mail[1].html, /Пробна порука/);
  assert.doesNotMatch(calls.mail[1].text, /Пробна порука/);
  assert.equal(calls.closed, 1);
});

test("HTML email escapes user content and preserves message line breaks", async () => {
  const { post, calls } = setup();
  const body = { ...valid, name: "Име <script>", subject: "Упис & питања", message: 'Први ред\n<img src=x onerror="alert(1)"> & други ред' };
  assert.equal((await post(request(body))).status, 200);
  const mail = calls.mail[0];
  assert.match(mail.html, /Име &lt;script&gt;/);
  assert.match(mail.html, /Упис &amp; питања/);
  assert.match(mail.html, /Први ред<br>&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt; &amp; други ред/);
  assert.doesNotMatch(mail.html, /<script>|<img/);
  assert.match(mail.text, /Први ред\n<img/);
  assert.match(calls.mail[1].html, /Име &lt;script&gt;/);
  assert.doesNotMatch(calls.mail[1].html, /<script>|<img/);
});

test("confirmation emails use the selected language and reject invalid locales", async () => {
  for (const locale of ["sr", "en", "de"]) {
    const { post, calls } = setup();
    assert.equal((await post(request({ ...valid, locale, name: "A <B>" }))).status, 200);
    assert.match(calls.mail[1].html, new RegExp(`<html lang="${locale}">`));
    const translation = textModule.exports.contactText[locale];
    assert.equal(calls.mail[1].subject, translation.confirmationSubject);
    for (const field of ["confirmationTitle", "confirmationGreeting", "confirmationReceived", "confirmationReply", "confirmationAutomatic"]) {
      assert.ok(calls.mail[1].html.includes(translation[field]));
      assert.ok(calls.mail[1].text.includes(translation[field]));
    }
    assert.match(calls.mail[1].html, /A &lt;B&gt;/);
    assert.doesNotMatch(calls.mail[1].html, /Пробна порука/);
  }
  const { post, calls } = setup();
  assert.equal((await post(request({ ...valid, locale: "fr" }))).status, 400);
  assert.equal(calls.mail.length, 0);
});

test("contact API error messages have English and German translations", async () => {
  const cases = [
    [setup(), request(valid, "https://other.example.test")],
    [setup(), request({ ...valid, email: "invalid" })],
    [setup(), request({ ...valid, phone: "12" })],
    [setup(), request({ ...valid, captchaToken: "" })],
    [setup({ captcha: { success: false, "error-codes": ["invalid-input-response"] } }), request(valid)],
    [setup({ env: {} }), request(valid)],
    [setup({ limit: false }), request(valid)],
  ];
  for (const [{ post }, input] of cases) {
    const response = await post(input);
    assert.ok(!response.ok);
    const { error } = await response.json();
    assert.ok(textModule.exports.contactText.en.apiErrors[error], `Missing English translation: ${error}`);
    assert.ok(textModule.exports.contactText.de.apiErrors[error], `Missing German translation: ${error}`);
  }
});

test("confirmation failure is reported without asking to resend an accepted school message", async () => {
  for (const options of [
    { confirmationAccepted: [], confirmationRejected: ["sender@example.test"] },
    { confirmationError: new Error("confirmation failed") },
  ]) {
    const { post, calls } = setup(options);
    const response = await post(request(valid));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, confirmationAccepted: false });
    assert.equal(calls.mail.length, 2);
    assert.equal(calls.errors.length, 1);
    assert.equal(calls.closed, 1);
  }
});

test("no confirmation is sent if the school message is not accepted", async () => {
  for (const options of [
    { accepted: [], rejected: ["school@example.test"] },
    { sendError: new Error("smtp down") },
  ]) {
    const { post, calls } = setup(options);
    assert.equal((await post(request(valid))).status, 503);
    assert.equal(calls.mail.length, 1);
    assert.equal(calls.closed, 1);
  }
});

test("invalid, oversized and cross-origin requests cannot reserve or send", async () => {
  const { post, calls } = setup();
  for (const [body, origin, status] of [
    [{ ...valid, email: "bad\n@example.test" }, undefined, 400],
    [{ ...valid, name: "x\nBcc: victim@example.test" }, undefined, 400],
    [{ ...valid, subject: "x\nBcc: victim@example.test" }, undefined, 400],
    [{ ...valid, phone: "12 abc" }, undefined, 400],
    [{ ...valid, subject: " " }, undefined, 400],
    [{ ...valid, captchaToken: "" }, undefined, 400],
    [{ ...valid, message: " " }, undefined, 400],
    ["x".repeat(33000), undefined, 400],
    [valid, "https://other.example.test", 403],
  ]) assert.equal((await post(request(body, origin))).status, status);
  assert.equal(calls.reservations, 0);
  assert.equal(calls.mail.length, 0);
});

test("phone number is optional", async () => {
  const { post, calls } = setup();
  assert.equal((await post(request({ ...valid, phone: "" }))).status, 200);
  assert.match(calls.mail[0].text, /Телефон: Није наведен/);
});

test("captcha must be verified before reserving or sending", async () => {
  for (const [options, status] of [
    [{ captcha: { success: false, "error-codes": ["invalid-input-response"] } }, 403],
    [{ captcha: { success: false, "error-codes": ["sitekey-secret-mismatch"] } }, 503],
    [{ captcha: { success: false } }, 503],
    [{ captcha: {} }, 503],
    [{ captchaStatus: 500 }, 503],
    [{ captchaError: new Error("offline") }, 503],
    [{ env: { ...config, HCAPTCHA_SECRET: "" } }, 503],
  ]) {
    const { post, calls } = setup(options);
    assert.equal((await post(request(valid))).status, status);
    assert.equal(calls.reservations, 0);
    assert.equal(calls.mail.length, 0);
  }
});

test("unconfigured service, rate limits and delivery failures never report success", async () => {
  for (const [options, status] of [
    [{ env: {} }, 503],
    [{ limit: false }, 429],
    [{ limitError: new Error("database down") }, 503],
    [{ accepted: [], rejected: ["school@example.test"] }, 503],
    [{ sendError: new Error("smtp down") }, 503],
  ]) {
    const { post } = setup(options);
    assert.equal((await post(request(valid))).status, status);
  }
});
