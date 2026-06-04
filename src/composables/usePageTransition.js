import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

function prefersReduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function usePageTransition(containerRef) {
  let ctx
  let exitTween = null

  onMounted(() => {
    ctx = gsap.context(() => {}, containerRef.value)
  })

  onUnmounted(() => {
    exitTween?.kill()
    ctx?.revert()
  })

  function exit(duration = 0.35) {
    return new Promise((resolve) => {
      if (prefersReduced()) {
        resolve()
        return
      }
      const children = containerRef.value?.children
      if (!children?.length) {
        resolve()
        return
      }
      exitTween = gsap.to(children, {
        opacity: 0,
        y: -20,
        scale: 0.97,
        duration,
        stagger: 0.04,
        ease: 'power2.in',
        onComplete: resolve,
      })
    })
  }

  function enter(duration = 0.5) {
    if (prefersReduced()) return
    const children = containerRef.value?.children
    if (!children?.length) return
    ctx?.revert()
    ctx = gsap.context(() => {
      gsap.from(children, {
        opacity: 0,
        y: 20,
        duration,
        stagger: 0.06,
        ease: 'power2.out',
      })
    }, containerRef.value)
  }

  return { exit, enter }
}
