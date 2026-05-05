<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <RouterLink to="/">
    <h1 class="flex items-center gap-2">
      <img class="w-8 h-8" src="/imgs/logo.svg" alt="logo" />
      <p class="font-semibold font-serif text-xl md:text-2xl">{{ props.text }}</p>
    </h1>
  </RouterLink>
</template>
