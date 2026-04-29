<script setup>
import AppHeader from '@/components/layouts/AppHeader.vue';
</script>
<template>
  <AppHeader/>
  <main class="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
    <RouterView />
  </main>
  <footer></footer>
</template>
