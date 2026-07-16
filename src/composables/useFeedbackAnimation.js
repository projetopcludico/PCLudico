import gsap from 'gsap'

export function useFeedbackAnimation(sequenceRefs) {
  function playCorrectFeedback(index) {
    return new Promise((resolve) => {
      const el = sequenceRefs.value[index]
      if (!el) { resolve(); return }

      gsap.fromTo(
        el,
        { boxShadow: '0 0 0 0 rgba(74, 222, 128, 0.4)' },
        {
          boxShadow: '0 0 20px 8px rgba(74, 222, 128, 0.3)',
          scale: 1.12,
          duration: 0.2,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(el, {
              scale: 1,
              duration: 0.3,
              ease: 'power2.in',
              delay: 0.1,
              clearProps: 'boxShadow',
              onComplete: resolve,
            })
          },
        },
      )
    })
  }

  function playWrongFeedback(index) {
    return new Promise((resolve) => {
      const el = sequenceRefs.value[index]
      if (!el) { resolve(); return }

      gsap.fromTo(
        el,
        { boxShadow: '0 0 0 0 rgba(74, 222, 128, 0.4)' },
        {
          boxShadow: '0 0 20px 8px rgba(255, 0, 0, 0.3)',
          duration: 0.05,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(el, {
              duration: 0.3,
              ease: 'power2.inOut',
              yoyo: true,
              clearProps: 'boxShadow',
              onComplete: resolve,
            })
          },
        },
      )
    })
  }

  return { playCorrectFeedback, playWrongFeedback }
}
