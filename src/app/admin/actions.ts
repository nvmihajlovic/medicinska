"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { isNewsCategory } from "@/lib/news-categories";
import { hasMediaSignature } from "@/lib/media-signature";

export type LoginState = { error: string | null };

export async function signInAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
  if (!getSupabaseConfig()) {
    return { error: "Администрација још није повезана са Supabase пројектом." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Унесите имејл и лозинку." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "Пријава није успела. Проверите податке и покушајте поново." };

  const { data: admin, error: roleError } = await supabase
    .from("school_admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (roleError) {
    await supabase.auth.signOut();
    return { error: "Није могуће проверити администраторска права. Проверите Supabase шему." };
  }

  if (!admin) {
    await supabase.auth.signOut();
    return { error: "Овај налог нема права за приступ администрацији." };
  }

  redirect("/admin");
}

export async function signOutAction() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) redirect("/admin?error=logout");
  redirect("/admin/login");
}

async function requireAdmin() {
  if (!getSupabaseConfig()) redirect("/admin?error=configuration");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/admin/login?error=session");

  const { data: admin, error: roleError } = await supabase
    .from("school_admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (roleError) redirect("/admin?error=database");
  if (!admin) redirect("/admin/login?error=not-admin");
  return supabase;
}

function getEntryValues(formData: FormData) {
  const kind = String(formData.get("kind") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const status = String(formData.get("status") ?? "draft");
  const category = String(formData.get("category") ?? "");
  const validKinds = ["news", "page", "program", "gallery", "document", "event"];

  if (!validKinds.includes(kind)) return { error: "Изаберите важећу врсту садржаја." as const };
  if (!title || title.length > 200) return { error: "Наслов је обавезан и мора имати највише 200 знакова." as const };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: "Адреса мора бити написана малим латиничним словима и раздвојена цртицама." as const };
  }
  if (excerpt.length > 1000) return { error: "Кратак опис може имати највише 1000 знакова." as const };
  if (!["draft", "published"].includes(status)) return { error: "Изаберите важећи статус објаве." as const };
  if (kind === "news" && !isNewsCategory(category)) return { error: "Изаберите важећу категорију вести." as const };

  return {
    value: {
      kind,
      title,
      slug,
      excerpt,
      body,
      status,
      category: kind === "news" ? category : null,
      published_at: status === "published" ? new Date().toISOString() : null,
    },
  };
}

export async function saveEntryAction(formData: FormData) {
  const supabase = await requireAdmin();
  const parsed = getEntryValues(formData);
  if (!parsed.value) redirect(`/admin?error=invalid&detail=${encodeURIComponent(parsed.error)}`);

  const id = String(formData.get("id") ?? "").trim();
  const file = formData.get("media");
  let mediaPath: string | undefined;

  if (file instanceof File && file.size > 0) {
    const allowedTypes: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "application/pdf": "pdf",
    };
    const extension = allowedTypes[file.type];
    if (!extension) redirect("/admin?error=media-type");
    if (file.size > 10 * 1024 * 1024) redirect("/admin?error=media-size");
    const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    if (!hasMediaSignature(file.type, header)) redirect("/admin?error=media-type");

    mediaPath = `${parsed.value.kind}/${randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("school-media")
      .upload(mediaPath, file, { contentType: file.type, upsert: false });

    if (uploadError) redirect("/admin?error=upload");
  }

  const values = mediaPath ? { ...parsed.value, media_path: mediaPath } : parsed.value;
  const query = id
    ? supabase.from("content_entries").update(values).eq("id", id)
    : supabase.from("content_entries").insert(values);
  const { error: saveError } = await query;

  if (saveError) {
    if (mediaPath) await supabase.storage.from("school-media").remove([mediaPath]);
    const code = saveError.code === "23505" ? "duplicate-slug" : "save";
    redirect(`/admin?error=${code}`);
  }

  redirect("/admin?status=saved");
}

export async function deleteEntryAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect("/admin?error=invalid-id");

  const { data: entry, error: readError } = await supabase
    .from("content_entries")
    .select("id, media_path")
    .eq("id", id)
    .maybeSingle();

  if (readError) redirect("/admin?error=delete");
  if (!entry) redirect("/admin?error=not-found");

  const { error: deleteError } = await supabase.from("content_entries").delete().eq("id", id);
  if (deleteError) redirect("/admin?error=delete");

  if (entry.media_path) {
    const { error: mediaError } = await supabase.storage.from("school-media").remove([entry.media_path]);
    if (mediaError) redirect("/admin?error=media-cleanup");
  }

  redirect("/admin?status=deleted");
}
