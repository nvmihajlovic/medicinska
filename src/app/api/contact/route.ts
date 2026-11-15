import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import { engagementClient } from "@/lib/news-engagement";
import { isSameOrigin } from "@/lib/request-origin";
import { readLimitedBody } from "@/lib/request-body";
import { contactText } from "@/lib/contact-text";
import type { Locale } from "@/lib/localization";

const unavailable = () => NextResponse.json({ error: "Слање тренутно није доступно. Обратите нам се имејлом или телефоном." }, { status: 503 });
const invalid = () => NextResponse.json({ error: "Проверите унете податке и покушајте поново." }, { status: 400 });

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function contactEmailHtml({ name, email, phone, subject, message }: {
  name: string; email: string; phone: string; subject: string; message: string;
}) {
  const rows = [
    ["Име и презиме", name],
    ["Имејл адреса", email],
    ["Број телефона", phone || "Није наведен"],
    ["Тема", subject],
  ].map(([label, value]) => `<tr><td style="padding:14px 0;border-bottom:1px solid #d7dfe4;font-size:13px;color:#3b4e5c;vertical-align:top;">${label}</td><td style="padding:14px 0 14px 16px;border-bottom:1px solid #d7dfe4;font-size:15px;line-height:1.5;color:#17364f;font-weight:600;overflow-wrap:anywhere;vertical-align:top;">${escapeHtml(value)}</td></tr>`).join("");
  const body = escapeHtml(message).replace(/\r\n|\r|\n/g, "<br>");
  return `<!doctype html>
<html lang="sr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Порука са сајта школе</title></head>
<body style="margin:0;padding:0;background:#edf2f5;color:#1c3448;font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#edf2f5;"><tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #d7dfe4;">
      <tr><td style="padding:24px 30px;background:#17364f;border-bottom:4px solid #8b2e3b;color:#ffffff;">
        <p style="margin:0 0 5px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#d7e5ee;">Медицинска школа · Панчево</p>
        <p style="margin:0;font-family:Cambria,Georgia,serif;font-size:21px;line-height:1.3;">„Стевица Јовановић”</p>
      </td></tr>
      <tr><td style="padding:30px;">
        <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:1px;color:#244e70;text-transform:uppercase;">Контакт форма</p>
        <h1 style="margin:0 0 10px;font-family:Cambria,Georgia,serif;font-size:30px;line-height:1.2;color:#17364f;">Нова порука</h1>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#3b4e5c;">Порука је послата преко контакт форме на сајту школе.</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #d7dfe4;table-layout:fixed;"><colgroup><col style="width:35%"><col style="width:65%"></colgroup>${rows}</table>
        <p style="margin:28px 0 10px;font-size:12px;font-weight:700;letter-spacing:1px;color:#244e70;text-transform:uppercase;">Порука</p>
        <div style="padding:20px;background:#f4f6f7;border-left:3px solid #244e70;font-size:16px;line-height:1.7;color:#1c3448;overflow-wrap:anywhere;">${body}</div>
        <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#3b4e5c;">За одговор пошиљаоцу користите опцију „Одговори” у свом имејл програму.</p>
      </td></tr>
      <tr><td style="padding:20px 30px;border-top:1px solid #d7dfe4;background:#f4f6f7;font-size:12px;line-height:1.5;color:#3b4e5c;">Медицинска школа „Стевица Јовановић” · Пастерова 2, Панчево</td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

function confirmationEmailHtml(name: string, locale: Locale) {
  const text = contactText[locale];
  return `<!doctype html>
<html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${text.confirmationSubject}</title></head>
<body style="margin:0;padding:0;background:#edf2f5;color:#1c3448;font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#edf2f5;"><tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #d7dfe4;">
      <tr><td style="padding:24px 30px;background:#17364f;border-bottom:4px solid #8b2e3b;color:#ffffff;">
        <p style="margin:0 0 5px;font-size:12px;color:#d7e5ee;">${locale === "sr" ? "Медицинска школа · Панчево" : locale === "en" ? "Medical School · Pančevo" : "Medizinische Schule · Pančevo"}</p>
        <p style="margin:0;font-family:Cambria,Georgia,serif;font-size:21px;line-height:1.3;">${locale === "sr" ? "„Стевица Јовановић”" : "Stevica Jovanović"}</p>
      </td></tr>
      <tr><td style="padding:30px;">
        <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#244e70;">${text.title}</p>
        <h1 style="margin:0 0 20px;font-family:Cambria,Georgia,serif;font-size:30px;line-height:1.2;color:#17364f;">${text.confirmationTitle}</h1>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#1c3448;overflow-wrap:anywhere;">${text.confirmationGreeting} ${escapeHtml(name)},</p>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#1c3448;">${text.confirmationReceived}</p>
        <p style="margin:0;font-size:16px;line-height:1.7;color:#1c3448;">${text.confirmationReply}</p>
        <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#3b4e5c;">${text.confirmationAutomatic}</p>
      </td></tr>
      <tr><td style="padding:20px 30px;border-top:1px solid #d7dfe4;background:#f4f6f7;font-size:12px;line-height:1.5;color:#3b4e5c;">${locale === "sr" ? "Медицинска школа „Стевица Јовановић” · Пастерова 2, Панчево" : locale === "en" ? "Medical School Stevica Jovanović · Pasterova 2, Pančevo" : "Medizinische Schule Stevica Jovanović · Pasterova 2, Pančevo"}</td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Захтев није дозвољен." }, { status: 403 });
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return invalid();
  let data: unknown;
  try {
    const body = await readLimitedBody(request, 32768);
    if (body === null) return invalid();
    data = JSON.parse(body);
  } catch {
    return invalid();
  }
  if (!data || typeof data !== "object" || !("name" in data) || !("email" in data) || !("phone" in data) ||
      !("subject" in data) || !("message" in data) || !("captchaToken" in data) ||
      typeof data.name !== "string" || typeof data.email !== "string" || typeof data.phone !== "string" ||
      typeof data.subject !== "string" || typeof data.message !== "string" || typeof data.captchaToken !== "string") return invalid();
  const name = data.name.trim();
  const email = data.email.trim();
  const phone = data.phone.trim();
  const subject = data.subject.trim();
  const message = data.message.trim();
  const captchaToken = data.captchaToken;
  if ("locale" in data && data.locale !== "sr" && data.locale !== "en" && data.locale !== "de") return invalid();
  const locale: Locale = "locale" in data && (data.locale === "en" || data.locale === "de") ? data.locale : "sr";
  const confirmationText = contactText[locale];
  if (!name || name.length > 100 || /[\r\n\x00-\x1f\x7f]/.test(name) ||
      email.length > 254 || /[\x00-\x1f\x7f]/.test(email) || !/^[^\s@<>(),;:"\\]+@[^\s@<>(),;:"\\]+\.[^\s@<>(),;:"\\]+$/.test(email) ||
      !subject || subject.length > 120 || /[\x00-\x1f\x7f]/.test(subject) ||
      !message || message.length > 5000 || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(message)) return invalid();
  if (phone !== "" && (phone.length > 30 || !/^[+0-9(). /-]+$/.test(phone) || phone.replace(/\D/g, "").length < 6)) {
    return NextResponse.json({ error: "Проверите број телефона: потребно је најмање шест цифара." }, { status: 400 });
  }
  if (!captchaToken || captchaToken.length > 8192) return NextResponse.json({ error: "Довршите безбедносну проверу пре слања." }, { status: 400 });

  const { CONTACT_SMTP_HOST: host, CONTACT_SMTP_PORT: portValue, CONTACT_SMTP_USER: user,
    CONTACT_SMTP_PASSWORD: pass, CONTACT_FROM: from, CONTACT_TO: to,
    NEXT_PUBLIC_HCAPTCHA_SITEKEY: sitekey, HCAPTCHA_SECRET: secret } = process.env;
  const port = Number(portValue);
  const client = engagementClient();
  if (!host || !user || !pass || !from || !to || !sitekey || !secret || !Number.isInteger(port) || port < 1 || port > 65535 || !client) return unavailable();

  try {
    const verification = await fetch("https://api.hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: captchaToken, sitekey }),
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    if (!verification.ok) {
      console.error("hCaptcha сервис за проверу није доступан.", verification.status);
      return unavailable();
    }
    const result: unknown = await verification.json();
    if (!result || typeof result !== "object" || !("success" in result) || typeof result.success !== "boolean") {
      console.error("hCaptcha сервис је вратио неисправан одговор.");
      return unavailable();
    }
    if (!result.success) {
      const codes = "error-codes" in result && Array.isArray(result["error-codes"]) ? result["error-codes"] : [];
      const retryable = ["missing-input-response", "invalid-input-response", "expired-input-response", "already-seen-response"];
      if (codes.length && codes.every((code: unknown) => typeof code === "string" && retryable.includes(code))) {
        return NextResponse.json({ error: "Безбедносна провера није успела. Покушајте поново." }, { status: 403 });
      }
      console.error("hCaptcha провера није успела због грешке сервиса или подешавања.", codes);
      return unavailable();
    }
  } catch (error) {
    console.error("hCaptcha провера није доступна.", error);
    return unavailable();
  }

  const { data: allowed, error } = await client.rpc("reserve_contact_message");
  if (error) {
    console.error("Ограничење слања контакт порука није доступно.", error);
    return unavailable();
  }
  if (allowed !== true) return NextResponse.json({ error: "Тренутно је достигнут број порука. Покушајте касније или нам пишите имејлом." }, { status: 429 });

  const transport = nodemailer.createTransport({
    host, port, secure: port === 465, requireTLS: true, auth: { user, pass },
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 20000,
  });
  try {
    const result = await transport.sendMail({
      from, to, replyTo: email, subject: `Контакт школе: ${subject}`,
      text: `Име: ${name}\nИмејл: ${email}\nТелефон: ${phone || "Није наведен"}\nТема: ${subject}\n\n${message}`,
      html: contactEmailHtml({ name, email, phone, subject, message }),
    });
    if (!result.accepted.length || result.rejected.length) {
      console.error("Сервис није прихватио контакт поруку.");
      return unavailable();
    }
    let confirmationAccepted = false;
    try {
      const confirmation = await transport.sendMail({
        from, to: email, replyTo: to, subject: confirmationText.confirmationSubject,
        headers: { "Auto-Submitted": "auto-replied", "X-Auto-Response-Suppress": "All" },
        text: `${confirmationText.confirmationGreeting} ${name},\n\n${confirmationText.confirmationTitle}. ${confirmationText.confirmationReceived}\n\n${confirmationText.confirmationReply}\n\n${confirmationText.confirmationAutomatic}\n${locale === "sr" ? "Медицинска школа „Стевица Јовановић” · Пастерова 2, Панчево" : locale === "en" ? "Medical School Stevica Jovanović · Pasterova 2, Pančevo" : "Medizinische Schule Stevica Jovanović · Pasterova 2, Pančevo"}`,
        html: confirmationEmailHtml(name, locale),
      });
      confirmationAccepted = confirmation.accepted.length > 0 && confirmation.rejected.length === 0;
      if (!confirmationAccepted) console.error("Сервис није прихватио аутоматску потврду контакт поруке.");
    } catch {
      console.error("Слање аутоматске потврде контакт поруке није успело.");
    }
    return NextResponse.json({ ok: true, confirmationAccepted }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Сервис електронске поште није прихватио контакт поруку.", error);
    return unavailable();
  } finally {
    transport.close();
  }
}
