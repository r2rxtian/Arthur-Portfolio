import { useCallback } from 'react';
import { registerSpotlight } from './pointer';

/** One easing curve for every executive tween, so the page moves with a single voice. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Callback ref that feeds an element eased --mx/--my/--spot values from the global pointer.
 * The light keeps gliding and fades over `reach` px outside the box instead of freezing at its edge.
 */
export function useSpotlight<T extends HTMLElement>(reach = 140) {
  return useCallback((element: T | null) => {
    if (!element || prefersReducedMotion()) return;
    return registerSpotlight(element, reach);
  }, [reach]);
}
