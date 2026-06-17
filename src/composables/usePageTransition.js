import { useTransitionOverlay } from '@/composables/useTransitionOverlay'

function prefersReduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function usePageTransition() {
  const { fadeIn, fadeOut } = useTransitionOverlay()

  function exit(duration = 0.4) {
    return new Promise((resolve) => {
      if (prefersReduced()) { resolve(); return }
      fadeIn(duration).then(resolve)
    })
  }

  function enter(duration = 0.4) {
    if (prefersReduced()) return
    fadeOut(duration)
  }

  return { exit, enter }
}
