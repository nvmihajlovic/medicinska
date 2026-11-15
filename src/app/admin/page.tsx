import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { deleteEntryAction, saveEntryAction, signOutAction } from "./actions";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { newsCategories } from "@/lib/news-categories";

const kinds = [
  ["news", "Вест"],
  ["page", "Страница"],
  ["program", "Образовни профил"],
  ["gallery", "Галерија"],
  ["document", "Документ"],
  ["event", "Догађај"],
];

const errors: Record<string, string> = {
  configuration: "Недостаје Supabase конфигурација.",
  database: "Не могу да проверим улогу администратора. Проверите базу и RLS правила.",
  invalid: "Проверите унете податке.",
  "media-type": "Дозвољени су JPEG, PNG, WebP и PDF фајлови.",
  "media-size": "Фајл је већи од дозвољених 10 MB.",
  upload: "Фајл није могао да се отпреми. Проверите Storage bucket и RLS правила.",
  "duplicate-slug": "Ова адреса је већ заузета. Изаберите другу.",
  save: "Садржај није сачуван.",
  delete: "Садржај није обрисан.",
  "not-found": "Тражени садржај не постоји.",
  "invalid-id": "Идентификатор садржаја није важећи.",
  "media-cleanup": "Садржај је обрисан, али приложени фајл није уклоњен из Storage-а.",
  logout: "Одјава није успела. Освежите страницу и покушајте поново.",
};

const statuses: Record<string, string> = {
  saved: "Садржај је сачуван.",
  deleted: "Садржај је обрисан.",
};

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; status?: string; detail?: string }>;
}) {
  await connection();
  if (!getSupabaseConfig()) {
    return (
      <main className="admin-page">
        <section className="admin-card">
          <Link className="admin-back" href="/">← Назад на сајт</Link>
          <h1>Администрација није подешена</h1>
          <p>Унесите Supabase URL и anon key у <code>.env.local</code>, затим примените <code>supabase/schema.sql</code>.</p>
          <Link className="admin-button admin-button--link" href="/admin/login">Отвори пријаву</Link>
        </section>
      </main>
    );
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) redirect("/admin/login?error=session");
  if (!authData.user) redirect("/admin/login");

  const { data: admin, error: roleError } = await supabase
    .from("school_admins")
    .select("user_id")
    .eq("user_id", authData.user.id)
    .maybeSingle();

  if (roleError) {
    return (
      <main className="admin-page">
        <section className="admin-card">
          <h1>Администрација није повезана</h1>
          <p role="alert">Не могу да проверим права приступа. Проверите да ли је примењен <code>supabase/schema.sql</code>.</p>
        </section>
      </main>
    );
  }
  if (!admin) redirect("/admin/login?error=not-admin");

  const [{ data: entries, error: entriesError }, params] = await Promise.all([
    supabase
      .from("content_entries")
      .select("id, kind, slug, title, excerpt, body, media_path, status, published_at, category")
      .order("updated_at", { ascending: false }),
    searchParams,
  ]);

  return (
    <main className="admin-page admin-page--wide">
      <div className="admin-dashboard">
        <header className="admin-dashboard__header">
          <div>
            <p className="eyebrow">Медицинска школа · Панчево</p>
            <h1>Управљање садржајем</h1>
            <p>Пријављени сте као {authData.user.email}.</p>
          </div>
          <div className="admin-actions">
            <Link className="admin-button admin-button--secondary" href="/">Погледај сајт</Link>
            <form action={signOutAction}><button className="admin-button admin-button--secondary" type="submit">Одјави се</button></form>
          </div>
        </header>

        {params.error && (
          <p className="admin-message admin-message--error" role="alert">
            {params.error === "invalid" && params.detail ? params.detail : (errors[params.error] ?? "Дошло је до грешке.")}
          </p>
        )}
        {params.status && statuses[params.status] && (
          <p className="admin-message admin-message--success" role="status">{statuses[params.status]}</p>
        )}
        {entriesError ? (
          <p className="admin-message admin-message--error" role="alert">
            Садржај није могао да се учита. Проверите да ли је примењена Supabase шема.
          </p>
        ) : (
          <>
            <section className="admin-card">
              <h2>Нови садржај</h2>
              <EntryForm action={saveEntryAction} />
            </section>
            <section className="admin-card">
              <div className="admin-list-heading">
                <h2>Садржај сајта</h2>
                <span>{entries?.length ?? 0} ставки</span>
              </div>
              {!entries?.length ? (
                <p className="admin-empty">Још нема унетог садржаја.</p>
              ) : (
                <div className="admin-entry-list">
                  {entries.map((entry) => (
                    <details className="admin-entry" key={entry.id}>
                      <summary>
                        <span><strong>{entry.title}</strong><small>{entry.kind} · {entry.slug}</small></span>
                        <span className={`entry-status entry-status--${entry.status}`}>{entry.status === "published" ? "Објављено" : "Нацрт"}</span>
                      </summary>
                      <EntryForm action={saveEntryAction} entry={entry} />
                      <form action={deleteEntryAction} className="admin-delete">
                        <input type="hidden" name="id" value={entry.id} />
                        <button className="admin-button admin-button--danger" type="submit">Обриши садржај</button>
                      </form>
                    </details>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function EntryForm({
  action,
  entry,
}: {
  action: (formData: FormData) => Promise<void>;
  entry?: {
    id: string;
    kind: string;
    slug: string;
    title: string;
    excerpt: string;
    body: string;
    status: string;
    category: string | null;
  };
}) {
  return (
    <form className="admin-form admin-form--grid" action={action} encType="multipart/form-data">
      {entry && <input type="hidden" name="id" value={entry.id} />}
      <label>
        Врста садржаја
        <select name="kind" defaultValue={entry?.kind ?? "news"} required>
          {kinds.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
        </select>
      </label>
      <label>
        Статус
        <select name="status" defaultValue={entry?.status ?? "draft"} required>
          <option value="draft">Нацрт</option>
          <option value="published">Објављено</option>
        </select>
      </label>
      <label>
        Категорија вести
        <select name="category" defaultValue={entry?.category ?? "obavestenja"} required>
          {newsCategories.map((category) => <option value={category.id} key={category.id}>{category.label}</option>)}
        </select>
      </label>
      <label>
        Наслов
        <input name="title" defaultValue={entry?.title ?? ""} maxLength={200} required />
      </label>
      <label>
        URL адреса
        <input name="slug" defaultValue={entry?.slug ?? ""} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required />
      </label>
      <label className="admin-field--wide">
        Кратак опис
        <textarea name="excerpt" defaultValue={entry?.excerpt ?? ""} maxLength={1000} rows={3} />
      </label>
      <label className="admin-field--wide">
        Садржај
        <textarea name="body" defaultValue={entry?.body ?? ""} rows={8} />
      </label>
      <label className="admin-field--wide">
        Слика или PDF (до 10 MB)
        <input name="media" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" />
      </label>
      <div className="admin-field--wide">
        <button className="admin-button" type="submit">{entry ? "Сачувај измене" : "Сачувај садржај"}</button>
      </div>
    </form>
  );
}
