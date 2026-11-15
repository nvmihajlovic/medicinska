export function youtubeEmbedUrl(value: string): string | null {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.username || url.password || url.port ||
      !["www.youtube.com", "youtube.com", "www.youtube-nocookie.com"].includes(url.hostname) ||
      !/^\/embed\/[a-zA-Z0-9_-]{11}$/.test(url.pathname)) return null;
  return url.href;
}
