import { LogoMark } from "./LogoMark";

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className={`group inline-flex items-center gap-2 font-display text-lg font-bold tracking-tight ${light ? "text-white" : "text-ink"}`}>
      <LogoMark
        light={light}
        className="size-9 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-0.5 group-hover:scale-115 motion-reduce:transition-none motion-reduce:group-hover:transform-none"
      />
      Clean World
    </span>
  );
}
