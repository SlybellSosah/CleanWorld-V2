import { useEffect, useRef } from "react";

let sharedObserver: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, () => void>();

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            sharedObserver?.unobserve(entry.target);
            callbacks.get(entry.target)?.();
            callbacks.delete(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
  }
  return sharedObserver;
}

/**
 * Progressive-enhancement scroll reveal: pre-rendered HTML stays visible (`opacity: 1`),
 * and only below-the-fold elements animate once when entering the viewport if reduced motion is off.
 */
export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top <= window.innerHeight * 0.96) return;

    const observer = getObserver();
    if (!observer) return;

    el.dataset.reveal = "pending";
    if (delay > 0) el.style.transitionDelay = `${Math.round(delay * 1000)}ms`;

    callbacks.set(el, () => {
      el.dataset.reveal = "shown";
    });
    observer.observe(el);

    return () => {
      observer.unobserve(el);
      callbacks.delete(el);
    };
  }, [delay]);

  return (
    <div ref={ref} className={className || undefined}>
      {children}
    </div>
  );
}
