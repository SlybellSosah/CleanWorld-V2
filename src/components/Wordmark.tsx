export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display text-lg font-bold tracking-tight ${light ? "text-white" : "text-ink"}`}>
      <img src="/logo-mark.png" alt="" width={36} height={36} className="size-9" />
      Clean World
    </span>
  );
}
