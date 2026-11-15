"use client";

import { useActionState } from "react";
import { signInAction, type LoginState } from "../actions";

const initialState: LoginState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  return (
    <form className="admin-form" action={formAction}>
      <label>
        Имејл адреса
        <input name="email" type="email" autoComplete="username" required />
      </label>
      <label>
        Лозинка
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      <button className="admin-button" type="submit" disabled={pending}>
        {pending ? "Пријава у току…" : "Пријави се"}
      </button>
      {state.error && <p className="admin-message admin-message--error" role="alert">{state.error}</p>}
    </form>
  );
}
