const siteUrl = process.env.SITE_URL || process.env.URL || "https://medicinska-2.netlify.app";
export const metadataBase = new URL(siteUrl);
if (metadataBase.protocol !== "https:" && metadataBase.protocol !== "http:") {
  throw new Error("SITE_URL мора да користи HTTP или HTTPS.");
}

export const defaultShareImage = {
  url: "/images/getty-images-Qz8F6d3pzEw-unsplash.jpg",
  width: 2400,
  height: 1600,
  alt: "Медицински радници мере крвни притисак пацијенту",
};

export function shareImage(path: string | null | undefined, alt: string) {
  return path && /\.(?:jpe?g|png|webp|gif)$/i.test(path.split(/[?#]/, 1)[0]) ? { url: path, alt } : defaultShareImage;
}
