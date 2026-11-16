export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display text-lg font-bold tracking-tight ${light ? "text-white" : "text-ink"}`}>
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
        <circle cx="16" cy="16" r="15" fill="#047857" />
        <path d="M9 20c0-6 4-10 13-11-1 9-5 13-11 13 1-4 3-7 7-9-4 1-7 3-9 7Z" fill="#fff" />
      </svg>
      Clean World
    </span>
  );
}
