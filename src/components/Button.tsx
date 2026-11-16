import { Link } from "react-router";

type Tone = "leaf" | "sun" | "outline" | "outline-light";

const TONES: Record<Tone, string> = {
  leaf: "bg-leaf text-white hover:bg-leaf-deep",
  sun: "bg-sun text-navy hover:bg-white",
  outline: "border-2 border-ink text-ink hover:bg-ink hover:text-white",
  "outline-light": "border-2 border-white/70 text-white hover:bg-white hover:text-navy",
};

const BASE =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 font-display text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

export const buttonClass = (tone: Tone = "leaf", extra = "") => `${BASE} ${TONES[tone]} ${extra}`;

export function ButtonLink({ to, tone, className, children }: { to: string; tone?: Tone; className?: string; children: React.ReactNode }) {
  const external = /^(https?:|tel:|mailto:)/.test(to);
  return external ? (
    <a href={to} className={buttonClass(tone, className)} {...(to.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>
      {children}
    </a>
  ) : (
    <Link to={to} className={buttonClass(tone, className)}>
      {children}
    </Link>
  );
}
