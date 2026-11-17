/**
 * Canonical flat vector emblem matching the Clean World Inc. brand mark.
 * Uses brighter, high-contrast fills when rendered on dark surfaces (`light = true`).
 */
export function LogoMark({ light = false, className = "size-9" }: { light?: boolean; className?: string }) {
  const blue = light ? "#3898ec" : "#1c66ad";
  const emerald = light ? "#22b254" : "#179642";
  const lime = light ? "#74c938" : "#64b32c";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={36}
      height={36}
      aria-hidden="true"
      className={className}
    >
      <path
        fill={blue}
        d="M 39 4.5 A 28 28 0 1 0 40 58.5 C 25 53 17 43 17 32 C 17 20 26 9.5 39 4.5 Z"
      />
      <path
        fill={emerald}
        d="M 43.5 9 A 28 28 0 0 1 42 57.5 C 47.5 48 48.5 38 47.5 29 C 49.5 20 48.5 13.5 43.5 9 Z"
      />
      <path
        fill={lime}
        d="M 25.5 14.5 C 32 8.5 40.5 8.5 44.5 13 C 47.5 18.5 46.5 27.5 43 33.5 C 39.5 22.5 33 16 25.5 14.5 Z"
      />
      <path
        fill={lime}
        d="M 43.5 36.5 C 45 44 43 51.5 38 55 C 33 56.5 28.5 53 26.5 48.5 C 34 49 40 43.5 43.5 36.5 Z"
      />
    </svg>
  );
}
