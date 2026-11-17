import { ArrowUpRight } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { Link } from "react-router";

type Tone = "leaf" | "sky" | "sun" | "navy" | "outline" | "outline-light";

const TONES: Record<Tone, string> = {
  leaf: "btn-tone-leaf",
  sky: "btn-tone-sky",
  sun: "btn-tone-sun",
  navy: "btn-tone-navy",
  outline: "btn-tone-outline",
  "outline-light": "btn-tone-outline-light",
};

export const buttonClass = (tone: Tone = "leaf", extra = "") =>
  `btn-pill ${TONES[tone]} disabled:cursor-not-allowed disabled:opacity-60 ${extra}`.trim();

function DiscArrow() {
  return (
    <span aria-hidden="true" className="btn-disc">
      <ArrowUpRight className="btn-arrow-a size-4" aria-hidden="true" />
      <ArrowUpRight className="btn-arrow-b size-4" aria-hidden="true" />
    </span>
  );
}

export function Button({
  tone = "leaf",
  withArrow = false,
  className = "",
  type = "button",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone; withArrow?: boolean }) {
  return (
    <button type={type} data-disc={withArrow ? "true" : undefined} className={buttonClass(tone, className)} {...props}>
      {withArrow ? (
        <>
          <span className="btn-label">{children}</span>
          <DiscArrow />
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function ButtonLink({
  to,
  tone = "leaf",
  withArrow = true,
  className = "",
  children,
  onClick,
}: {
  to: string;
  tone?: Tone;
  withArrow?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const external = /^(https?:|tel:|mailto:)/.test(to);
  const content = withArrow ? (
    <>
      <span className="btn-label">{children}</span>
      <DiscArrow />
    </>
  ) : (
    children
  );
  const discAttr = withArrow ? ("true" as const) : undefined;

  return external ? (
    <a
      href={to}
      data-disc={discAttr}
      onClick={onClick}
      className={buttonClass(tone, className)}
      {...(to.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
    >
      {content}
    </a>
  ) : (
    <Link to={to} data-disc={discAttr} onClick={onClick} className={buttonClass(tone, className)}>
      {content}
    </Link>
  );
}
