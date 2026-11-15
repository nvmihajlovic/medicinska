"use client";

import Link from "next/link";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRef, useState, type FormEvent } from "react";
import { ContactLabel } from "@/components/contact-label";
import { LanguageText } from "@/components/language-size";
import { contactText } from "@/lib/contact-text";
import type { Locale } from "@/lib/localization";

const mapLink = "https://www.google.com/maps/search/?api=1&query=Medicinska+skola+Stevica+Jovanovic+Pasterova+2+Pancevo";
const mapEmbed = "https://maps.google.com/maps?q=Medicinska%20skola%20Stevica%20Jovanovic%20Pasterova%202%20Pancevo&output=embed";

export function ContactForm({ locale = "sr" }: { locale?: Locale }) {
  const text = contactText[locale];
  const sitekey = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY;
  const captcha = useRef<HCaptcha>(null);
  const [status, setStatus] = useState<{ text: string; error: boolean } | null>(null);
  const [sending, setSending] = useState(false);
  const [captchaEnabled, setCaptchaEnabled] = useState(false);
  const [captchaError, setCaptchaError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaVersion, setCaptchaVersion] = useState(0);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    if (!sitekey) {
      setStatus({ text: text.missingConfig, error: true });
      return;
    }
    if (!captchaToken) {
      setStatus({ text: text.needCaptcha, error: true });
      return;
    }
    const form = event.currentTarget;
    const data = new FormData(form);
    setSending(true);
    setStatus(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.get("name"), email: data.get("email"), phone: data.get("phone"), subject: data.get("subject"), message: data.get("message"), captchaToken, locale }),
      });
      const result = await response.json();
      if (!response.ok) {
        const translated = Object.entries(text.apiErrors).find(([message]) => message === result.error)?.[1];
        if (!translated) console.error("Неочекиван одговор контакт форме.", response.status);
        setStatus({ text: translated ?? text.failure, error: true });
        return;
      }
      form.reset();
      setStatus({
        text: result.confirmationAccepted === true
          ? text.accepted
          : text.acceptedNoConfirmation,
        error: false,
      });
    } catch (error) {
      console.error("Слање поруке није успело.", error);
      setStatus({ text: text.uncertain, error: true });
    } finally {
      captcha.current?.resetCaptcha();
      setCaptchaToken("");
      setSending(false);
    }
  }

  return <form className="contact-form" onSubmit={submit}>
    <div className="contact-form__heading">
      <div><p className="eyebrow"><ContactLabel locale={locale} name="form" /></p><h3><ContactLabel locale={locale} name="send" /></h3></div>
      <p><ContactLabel locale={locale} name="required" /></p>
    </div>
    <div className="contact-form__row">
      <label><span><ContactLabel locale={locale} name="name" /> <b aria-hidden="true">*</b></span><input name="name" autoComplete="name" required maxLength={100} placeholder={text.namePlaceholder} /></label>
      <label><span><ContactLabel locale={locale} name="email" /> <b aria-hidden="true">*</b></span><input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="ime@primer.rs" /></label>
    </div>
    <div className="contact-form__row">
      <label><span><ContactLabel locale={locale} name="phone" /> <small><ContactLabel locale={locale} name="optional" /></small></span><input name="phone" type="tel" autoComplete="tel" maxLength={30} aria-describedby="contact-phone-hint" placeholder={text.phonePlaceholder} /><small id="contact-phone-hint"><ContactLabel locale={locale} name="phoneHint" /></small></label>
      <label><span><ContactLabel locale={locale} name="subject" /> <b aria-hidden="true">*</b></span><input name="subject" required maxLength={120} placeholder={text.subjectPlaceholder} /></label>
    </div>
    <label><span><ContactLabel locale={locale} name="message" /> <b aria-hidden="true">*</b></span><textarea name="message" rows={6} required maxLength={5000} placeholder={text.messagePlaceholder} /></label>
    <p className="contact-form__note"><ContactLabel locale={locale} name="privacyNote" /> <Link href={locale === "sr" ? "/privatnost" : `/${locale}/privatnost`}><ContactLabel locale={locale} name="privacy" /></Link></p>
    <div className="contact-form__security">
      <div><p className="contact-form__security-title"><ContactLabel locale={locale} name="security" /></p><p><ContactLabel locale={locale} name="securityInfo" /></p></div>
      {!sitekey ? <p className="contact-form__security-error"><ContactLabel locale={locale} name="notConfigured" /></p> :
        !captchaEnabled ? <button className="contact-form__verify" type="button" onClick={() => setCaptchaEnabled(true)}><ContactLabel locale={locale} name="verify" /> <span aria-hidden="true">→</span></button> :
          <div className="contact-form__captcha">
            <HCaptcha key={captchaVersion} ref={captcha} sitekey={sitekey} size="compact" languageOverride={locale} sentry={false}
              onVerify={(token) => { setCaptchaToken(token); setCaptchaError(""); setStatus(null); }}
              onExpire={() => { setCaptchaToken(""); setCaptchaError(text.expired); }}
              onError={() => { setCaptchaToken(""); setCaptchaError(text.captchaError); }} />
            {captchaError && <div role="alert"><p className="contact-form__security-error">{captchaError}</p><button className="contact-form__verify" type="button" onClick={() => { setCaptchaError(""); setCaptchaVersion((version) => version + 1); }}>{text.reload} <span aria-hidden="true">→</span></button></div>}
          </div>}
    </div>
    <div className="contact-form__actions">
      <button className="button button--primary" type="submit" disabled={sending}><ContactLabel locale={locale} name={sending ? "sending" : "send"} /> <span aria-hidden="true">→</span></button>
      <p><ContactLabel locale={locale} name="reply" /></p>
    </div>
    {status && <p className={`contact-form__status${status.error ? " contact-form__status--error" : ""}`} role={status.error ? "alert" : "status"}>{status.text}</p>}
  </form>;
}

export function ContactMap({ locale = "sr" }: { locale?: Locale }) {
  const text = contactText[locale];
  const [loaded, setLoaded] = useState(false);
  return <div className="contact-map">
    {loaded ? <iframe title={text.mapTitle} src={mapEmbed} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" /> :
      <div className="contact-map__placeholder">
        <span className="contact-map__pin" aria-hidden="true">⌖</span>
        <h3><LanguageText locale={locale} values={{ sr: `${contactText.sr.address}, ${contactText.sr.city}`, en: `${contactText.en.address}, ${contactText.en.city}`, de: `${contactText.de.address}, ${contactText.de.city}` }} /></h3>
        <p><ContactLabel locale={locale} name="mapInfo" /></p>
        <button className="button button--primary" type="button" onClick={() => setLoaded(true)}><ContactLabel locale={locale} name="loadMap" /> <span aria-hidden="true">→</span></button>
      </div>}
    <a className="contact-map__link" href={mapLink} target="_blank" rel="noopener noreferrer"><ContactLabel locale={locale} name="openMap" /> <span aria-hidden="true">↗</span></a>
  </div>;
}
