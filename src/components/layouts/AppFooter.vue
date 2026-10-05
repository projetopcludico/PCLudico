<script setup>
import LogoText from '../decorators/LogoText.vue'
const links = [
  {
    title: 'Início',
    value: '/',
  },
]

const realizcao = [
  {
    src: '/imgs/logo-ifc.svg',
    class: 'w-50 dark:hidden',
    alt: 'Logo IFC - Campus Araquari',
    link: 'https://araquari.ifc.edu.br/',
  },
  {
    src: '/imgs/logo-ifc-dark.svg',
    class: 'w-50 hidden dark:block',
    alt: 'Logo IFC - Campus Araquari',
    link: 'https://araquari.ifc.edu.br/',
  },
  {
    src: '/imgs/logo-fabrica.svg',
    class: 'w-25 dark:hidden',
    alt: 'Logo Fábrica de Software',
    link: 'https://fabricadesoftware.ifc.edu.br/',
  },
  {
    src: '/imgs/logo-fabrica-dark.svg',
    class: 'w-25 hidden dark:block',
    alt: 'Logo Fábrica de Software',
    link: 'https://fabricadesoftware.ifc.edu.br/',
  },
]

</script>
<template>
  <footer
    class="flex flex-col p-5 bg-white text-slate-900 dark:bg-slate-900 dark:text-white md:p-20 md:flex-row md:justify-between"
  >
    <div class="w-full flex flex-col gap-5 items-center md:items-start md:w-fit">
      <LogoText text="MOSAICO" />
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
    <div class="flex flex-col gap-5">
      <h2 class="font-semibold">Realização:</h2>
      <ul class="flex gap-10 items-center">
        <li v-for="(link, index) in realizcao" :key="index">
          <a :href="link.link">
            <img :class="link.class" :src="link.src" :alt="link.alt">
          </a>
        </li>
      </ul>
    </div>
  </footer>
</template>
