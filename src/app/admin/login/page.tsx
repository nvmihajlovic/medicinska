import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await connection();
  if (getSupabaseConfig()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) redirect("/admin");
  }

  const { error } = await searchParams;
  const message = error === "not-admin"
    ? "Овај налог нема права за приступ администрацији."
    : error === "session"
      ? "Сесија је истекла. Пријавите се поново."
      : null;

  return (
    <main className="admin-page">
      <section className="admin-card">
        <Link className="admin-back" href="/">← Назад на сајт</Link>
        <p className="eyebrow">Медицинска школа · Панчево</p>
        <h1>Администрација</h1>
        <p className="admin-intro">Пријавите се да бисте управљали вестима, страницама и документима школе.</p>
        {!getSupabaseConfig() ? (
          <div className="admin-message admin-message--error" role="status">
            Администрација још није повезана са Supabase пројектом. Копирајте <code>.env.example</code>
            у <code>.env.local</code>, унесите URL и anon key, па примените <code>supabase/schema.sql</code>.
            Затим направите корисника у Supabase Authentication и покрените <code>supabase/make-first-admin.sql</code>
            са његовом имејл адресом.
          </div>
        ) : (
          <>
            {message && <p className="admin-message admin-message--error" role="alert">{message}</p>}
            <LoginForm />
          </>
        )}
      </section>
    </main>
  );
}
