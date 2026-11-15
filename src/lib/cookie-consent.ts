export const consentCookie = "school-cookie-preferences";
export const visitorCookie = "school-news-visitor";
export const consentMaxAge = 60 * 60 * 24 * 180;

export function parseConsent(value: string | undefined) {
  if (!value || !/^v1-[01]-[01]$/.test(value)) return null;
  return { analytics: value[3] === "1", video: value[5] === "1" };
}

export function consentValue(analytics: boolean, video: boolean) {
  return `v1-${analytics ? "1" : "0"}-${video ? "1" : "0"}`;
}
