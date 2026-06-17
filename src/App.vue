<script setup>
import { useTransitionOverlay } from '@/composables/useTransitionOverlay'
import router from './router'

const { register, fadeOut } = useTransitionOverlay()

router.afterEach(() => {
  fadeOut(0.4)
})
</script>

<template>
  <RouterView />
  <div :ref="register" class="fixed inset-0 bg-black z-50 pointer-events-none" style="opacity: 0" />
</template>
