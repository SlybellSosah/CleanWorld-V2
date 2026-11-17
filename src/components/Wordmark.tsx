import { LogoMark } from "./LogoMark";

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display text-lg font-bold tracking-tight ${light ? "text-white" : "text-ink"}`}>
      <LogoMark light={light} className="size-9 shrink-0" />
      Clean World
    </span>
  );
}
