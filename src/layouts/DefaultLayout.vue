<script setup>
import AppFooter from '@/components/layouts/AppFooter.vue';
import AppHeader from '@/components/layouts/AppHeader.vue';
</script>
<template>
  <AppHeader/>
  <main class="min-h-screen bg-white text-slate-800 dark:bg-slate-900 dark:text-white">
    <RouterView />
  </main>
  <AppFooter/>
</template>
