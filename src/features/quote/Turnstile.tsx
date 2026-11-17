import { useEffect, useImperativeHandle, useRef, type Ref } from "react";

const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const LOAD_TIMEOUT_MS = 8_000;

interface TurnstileRenderOptions {
  sitekey: string;
  callback(token: string): void;
  "expired-callback"(): void;
  "error-callback"(): boolean;
  "timeout-callback"(): void;
}

interface TurnstileApi {
  render(el: HTMLElement, opts: TurnstileRenderOptions): string;
  reset(id: string): void;
  remove?(id: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    __CW_TURNSTILE_SITE_KEY?: string;
  }
}

/** Configured Turnstile site key; build-time env var always takes precedence when set. */
export function activeTurnstileSiteKey(): string | undefined {
  return import.meta.env.VITE_TURNSTILE_SITE_KEY || (typeof window !== "undefined" ? window.__CW_TURNSTILE_SITE_KEY : undefined) || undefined;
}

export interface TurnstileHandle {
  /** The current token, or undefined if the widget is not ready or unavailable. */
  token(): string | undefined;
  /** Tokens are single-use: call after every submit attempt. */
  reset(): void;
  unavailable(): boolean;
}

export function Turnstile({ ref }: { ref: Ref<TurnstileHandle> }) {
  const box = useRef<HTMLDivElement>(null);
  const state = useRef<{ token?: string; id?: string; unavailable: boolean }>({ unavailable: false });
  const siteKey = activeTurnstileSiteKey();

  useImperativeHandle(ref, () => ({
    token: () => state.current.token,
    unavailable: () => state.current.unavailable,
    reset: () => {
      state.current.token = undefined;
      if (state.current.id) window.turnstile?.reset(state.current.id);
    },
  }));

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;
    state.current = { unavailable: false };

    const markUnavailable = () => {
      if (cancelled) return;
      state.current.token = undefined;
      state.current.unavailable = true;
    };

    const timer = setTimeout(() => {
      if (!state.current.token) markUnavailable();
    }, LOAD_TIMEOUT_MS);

    const mount = () => {
      if (cancelled || !box.current || !window.turnstile || state.current.id) return;
      try {
        state.current.id = window.turnstile.render(box.current, {
          sitekey: siteKey,
          callback: (token) => {
            if (cancelled) return;
            clearTimeout(timer);
            state.current.token = token;
            state.current.unavailable = false;
          },
          "expired-callback": () => {
            state.current.token = undefined;
          },
          "error-callback": () => {
            clearTimeout(timer);
            markUnavailable();
            return true;
          },
          "timeout-callback": () => {
            clearTimeout(timer);
            markUnavailable();
          },
        });
      } catch {
        clearTimeout(timer);
        markUnavailable();
      }
    };

    let script = document.querySelector<HTMLScriptElement>('script[data-turnstile-script="true"]');
    if (window.turnstile) {
      mount();
    } else {
      if (!script || script.dataset.failed === "true") {
        script?.remove();
        script = document.createElement("script");
        script.src = SCRIPT;
        script.async = true;
        script.dataset.turnstileScript = "true";
        script.addEventListener("error", () => {
          if (script) script.dataset.failed = "true";
        });
        document.head.appendChild(script);
      }
      script.addEventListener("load", mount);
      script.addEventListener("error", markUnavailable);
    }

    return () => {
      cancelled = true;
      clearTimeout(timer);
      script?.removeEventListener("load", mount);
      script?.removeEventListener("error", markUnavailable);
      if (state.current.id) {
        try {
          window.turnstile?.remove?.(state.current.id);
        } catch {
          // Ignore teardown errors if the script unloaded.
        }
        state.current.id = undefined;
      }
    };
  }, [siteKey]);

  return siteKey ? <div ref={box} className="mt-2" data-testid="turnstile-widget" /> : null;
}
