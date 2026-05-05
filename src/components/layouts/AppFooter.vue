<script setup>
import LogoText from '../decorators/LogoText.vue'
const links = [
  {
    title: 'Início',
    value: '/',
  },
  {
    title: 'Sobre',
    value: '/about',
  },
  {
    title: 'Início',
    value: '/classroom',
  },
]

const socialMedias = [
  {
    link: 'https://youtube.com',
    icon: 'mdi mdi-youtube',
    color: 'text-red',
  },
  {
    link: 'https://instagram.com',
    icon: 'mdi mdi-instagram',
    color: 'text-orange',
  },
  {
    link: 'https://facebook.com',
    icon: 'mdi mdi-facebook',
    color: 'text-blue',
  },
]
</script>
<template>
  <footer
    class="flex flex-col p-5 bg-white text-slate-900 dark:bg-slate-900 dark:text-white md:p-20 md:flex-row md:justify-between"
  >
    <div class="w-full flex flex-col gap-5 items-center md:items-start md:w-fit">
      <LogoText text="TRAMA" />
      <nav class="w-full flex justify-center gap-10 md:flex-col md:gap-2">
        <RouterLink
          v-for="(link, index) in links"
          :to="link.value"
          :key="index"
          class="text-center font-semibold text-lg p-2 rounded-lg transition-all duration-200 hover:bg-slate-900/20 hover:dark:bg-white/20 active:bg-slate-900/20 active:dark:bg-white/20 md:w-fit"
        >
          {{ link.title }}
        </RouterLink>
      </nav>
    </div>
    <div class="flex flex-col justify-between">
      <nav class="flex justify-center gap-10 md:gap-5">
        <a
          v-for="(socialMedia, index) in socialMedias"
          :key="index"
          :href="socialMedia.link"
          class="transition-all duration-100 hover:scale-125"
        >
          <span :class="['text-4xl', socialMedia.icon, socialMedia.color]"></span>
        </a>
      </nav>
      <div class="flex flex-col gap-5">
        <h2 class="font-semibold">Realização:</h2>
        <div class="flex gap-10">
          <img class="w-50" src="/imgs/logo-ifc.svg" alt="Logo Fábrica de Software" />
          <img class="w-25" src="/imgs/logo-fabrica.svg" alt="Logo IFC - Capus Araquari" />
        </div>
      </div>
    </div>
  </footer>
</template>
