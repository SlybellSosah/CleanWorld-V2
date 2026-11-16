import { useEffect, useImperativeHandle, useRef, type Ref } from "react";

export const TURNSTILE_SITE_KEY: string | undefined = import.meta.env.VITE_TURNSTILE_SITE_KEY || undefined;
const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const LOAD_TIMEOUT_MS = 8_000;

interface TurnstileApi {
  render(el: HTMLElement, opts: { sitekey: string; callback(token: string): void; "expired-callback"(): void }): string;
  reset(id: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export interface TurnstileHandle {
  /** The current token, or undefined if the widget is unavailable. */
  token(): string | undefined;
  /** Tokens are single-use: call after every submit attempt. */
  reset(): void;
  unavailable(): boolean;
}

export function Turnstile({ ref }: { ref: Ref<TurnstileHandle> }) {
  const box = useRef<HTMLDivElement>(null);
  const state = useRef<{ token?: string; id?: string; unavailable: boolean }>({ unavailable: false });

  useImperativeHandle(ref, () => ({
    token: () => state.current.token,
    unavailable: () => state.current.unavailable,
    reset: () => {
      state.current.token = undefined;
      if (state.current.id) window.turnstile?.reset(state.current.id);
    },
  }));

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!state.current.id) state.current.unavailable = true;
    }, LOAD_TIMEOUT_MS);

    const mount = () => {
      if (cancelled || !box.current || !window.turnstile || state.current.id) return;
      state.current.id = window.turnstile.render(box.current, {
        sitekey: TURNSTILE_SITE_KEY!,
        callback: (token) => (state.current.token = token),
        "expired-callback": () => (state.current.token = undefined),
      });
      state.current.unavailable = false;
    };

    if (window.turnstile) mount();
    else {
      const script = document.createElement("script");
      script.src = SCRIPT;
      script.async = true;
      script.onload = mount;
      script.onerror = () => (state.current.unavailable = true);
      document.head.append(script);
    }
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return TURNSTILE_SITE_KEY ? <div ref={box} className="mt-2" /> : null;
}
