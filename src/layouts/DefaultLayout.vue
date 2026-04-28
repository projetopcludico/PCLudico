<script setup>
import AppHeader from '@/components/layouts/AppHeader.vue';
</script>
<template>
  <AppHeader/>
  <main class="min-h-screen bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">
    <RouterView />
  </main>
  <footer></footer>
</template>
