<script setup>
import CellingWaves from '@/components/decorators/CellingWaves.vue';
</script>
<template>
  <section class="h-full w-full">
    <div
      class="flex justify-center h-100 bg-linear-to-b from-white to-purple px-5 py-2 dark:from-slate-950 dark:to-purple-dark md:h-screen md:px-20 md:py-10"
    >
      <video
        controls
        src="/videos/tutorial.mp4"
        class="flex flex-col justify-center h-full items-center shadow-xl bg-white rounded-4xl dark:bg-slate-950 dark:text-white"
      >
        <span class="mdi mdi-play text-6xl"></span>
      </video>
      
    </div>
    <div class="">
      <CellingWaves/>
    </div>
  </section>
</template>
