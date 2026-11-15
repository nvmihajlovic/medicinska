import academic from "@/data/academic-content.json";

export const curricula = academic.profiles;
export const finalExams = academic.exams;
export const documentGroups = academic.documents;

const assets = new Map(academic.assets.map((asset) => [asset.originalUrl, asset]));

export function documentPath(url: string) {
  const asset = assets.get(url);
  if (!asset || asset.status !== "available" || !asset.localPath) {
    throw new Error(`Школски материјал није доступан: ${url}`);
  }
  return asset.localPath;
}

export function documentFormat(url: string) {
  const match = new URL(url, "https://medicinskapancevo.edu.rs").pathname.match(/\.([a-z0-9]+)$/i);
  if (!match) throw new Error(`Непознат формат школског материјала: ${url}`);
  return match[1].toUpperCase();
}

export function examQuestionGroup(slug: string) {
  return documentGroups.find((group) => group.path === `/ucenici/ispitna-pitanja/${slug}/`);
}

export const generalDocumentGroups = documentGroups.filter((group) =>
  !group.path.startsWith("/ucenici/ispitna-pitanja/") &&
  !finalExams.some((exam) => group.path === `/${exam.slug}/`),
);
