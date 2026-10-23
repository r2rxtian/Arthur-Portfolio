import { flushSync } from 'react-dom';

type TransitionDocument = Document & { startViewTransition?: (update: () => void) => { ready: Promise<void> } };

/** Applies a theme change as a circle that grows out of the control that triggered it. */
export function withThemeTransition(origin: HTMLElement, update: () => void) {
  const doc = document as TransitionDocument;
  if (!doc.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) { update(); return; }
  const bounds = origin.getBoundingClientRect();
  const x = bounds.left + bounds.width / 2;
  const y = bounds.top + bounds.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const transition = doc.startViewTransition(() => flushSync(update));
  void transition.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
    );
  });
}
