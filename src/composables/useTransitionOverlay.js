import { ref } from 'vue'
import gsap from 'gsap'

const overlayRef = ref(null)

export function useTransitionOverlay() {
  function register(el) {
    overlayRef.value = el
  }

  function fadeIn(duration = 0.4) {
    return new Promise(resolve => {
      if (!overlayRef.value) { resolve(); return }
      gsap.killTweensOf(overlayRef.value)
      gsap.to(overlayRef.value, {
        opacity: 1,
        duration,
        ease: 'power2.inOut',
        onComplete: resolve,
      })
    })
  }

  function fadeOut(duration = 0.4) {
    return new Promise(resolve => {
      if (!overlayRef.value) { resolve(); return }
      gsap.killTweensOf(overlayRef.value)
      gsap.to(overlayRef.value, {
        opacity: 0,
        duration,
        ease: 'power2.inOut',
        onComplete: resolve,
      })
    })
  }

  return { register, fadeIn, fadeOut }
}
