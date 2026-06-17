<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'

const containerRef = ref(null)
let ctx

const clouds = ref([
  { cls: 'w-[300px] h-[105px] left-[5%] opacity-[0.7]', speed: 1 },
  { cls: 'w-[250px] h-[88px] left-[22%] opacity-[0.5]', speed: 1.4 },
  { cls: 'w-[350px] h-[123px] left-[40%] opacity-[0.6]', speed: 0.8 },
  { cls: 'w-[220px] h-[77px] left-[58%] opacity-[0.4]', speed: 1.6 },
  { cls: 'w-[280px] h-[98px] left-[74%] opacity-[0.55]', speed: 1.1 },
  { cls: 'w-[200px] h-[70px] left-[88%] opacity-[0.35]', speed: 1.8 },
])

function animateCloud(el, speed) {
  const baseDuration = 20 / speed

  const startY = window.innerHeight + (100 + Math.random() * 400)
  gsap.set(el, { y: startY })

  function move() {
    gsap.to(el, {
      y: -(el.offsetHeight + 200),
      duration: baseDuration + Math.random() * 6,
      ease: 'none',
      onComplete: () => {
        gsap.set(el, { y: window.innerHeight + (100 + Math.random() * 400) })
        move()
      },
    })
  }

  move()
}

onMounted(() => {
  ctx = gsap.context(() => {
    const els = containerRef.value.querySelectorAll('.cloud-particle')
    els.forEach((el, i) => {
      animateCloud(el, clouds.value[i].speed)
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <div ref="containerRef" class="absolute inset-0 overflow-hidden bg-[#E3F5FF] dark:bg-slate-900">
    <div
      v-for="(cloud, i) in clouds"
      :key="i"
      class="cloud-particle absolute rounded-[50px] bg-white blur-[1px] overflow-visible before:absolute before:content-[''] before:bg-white before:rounded-full before:w-[45%] before:h-[140%] before:top-[-60%] before:left-[15%] after:absolute after:content-[''] after:bg-white after:rounded-full after:w-[55%] after:h-[170%] after:top-[-80%] after:left-[35%] dark:bg-gray-300"
      :class="cloud.cls"
    />
  </div>
</template>
