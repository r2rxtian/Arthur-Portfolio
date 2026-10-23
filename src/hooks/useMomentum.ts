import { useEffect, useRef, type RefObject } from 'react';
import Lenis, { type LenisOptions } from 'lenis';
import 'lenis/dist/lenis.css';

/**
 * Shared momentum feel: the wheel sets a target and the scroll eases toward it, so motion
 * glides and settles instead of stepping. Positions stay native (window.scrollY / scrollTop),
 * so sticky elements, IntersectionObserver and framer-motion's useScroll keep working.
 * Touch input keeps the platform's own inertia.
 */
export const MOMENTUM: LenisOptions = { lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true, syncTouch: false };

function reducedMotion() {
  return typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Momentum for the whole page (window scroll). Elements marked data-lenis-prevent scroll natively. */
export function usePageMomentum(enabled = true) {
  useEffect(() => {
    if (!enabled || reducedMotion()) return;
    const lenis = new Lenis({ ...MOMENTUM, autoRaf: true });

    // In-page links glide instead of jumping. Lenis's own `anchors` option lets the browser's
    // native jump run as well and the two fight, so links are handled here. scrollTo() already
    // subtracts the CSS scroll-padding that clears the sticky header.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      const id = link?.getAttribute('href')?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { duration: 1.25, easing: (t) => 1 - Math.pow(1 - t, 4) });
      history.replaceState(null, '', `#${id}`);
      // Match native anchors: keyboard focus continues from the target (needed for the skip link).
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    };
    document.addEventListener('click', onClick);
    return () => { document.removeEventListener('click', onClick); lenis.destroy(); };
  }, [enabled]);
}

/**
 * Momentum for a pane rendered by another component (possibly lazily): waits for an element
 * matching `selector` to mount, then scrolls it with momentum. Meant for static, read-only panes.
 */
export function useSelectorMomentum(selector: string | null) {
  useEffect(() => {
    if (!selector || reducedMotion()) return;
    let lenis: Lenis | null = null;
    let frame = 0;
    let tries = 0;
    const attach = () => {
      const element = document.querySelector<HTMLElement>(selector);
      if (element) { lenis = new Lenis({ ...MOMENTUM, wrapper: element, content: element, autoRaf: true, allowNestedScroll: true }); return; }
      if (++tries < 180) frame = requestAnimationFrame(attach);
    };
    attach();
    return () => { cancelAnimationFrame(frame); lenis?.destroy(); };
  }, [selector]);
}

/**
 * Momentum for a scrolling container. `content` must be a stable element inside `wrapper`
 * (Lenis watches its size). Nested scroll areas, such as code blocks, keep native scrolling.
 */
export function useContainerMomentum(wrapper: RefObject<HTMLElement | null>, content: RefObject<HTMLElement | null>, active: boolean) {
  const lenisRef = useRef<Lenis | null>(null);
  useEffect(() => {
    if (!active || reducedMotion() || !wrapper.current || !content.current) return;
    const lenis = new Lenis({ ...MOMENTUM, wrapper: wrapper.current, content: content.current, autoRaf: true, allowNestedScroll: true });
    lenisRef.current = lenis;
    return () => { lenis.destroy(); lenisRef.current = null; };
  }, [active, wrapper, content]);

  /** Jump to the top immediately, cancelling any glide still in progress. */
  return function resetToTop() {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true, force: true });
    else wrapper.current?.scrollTo({ top: 0 });
  };
}
