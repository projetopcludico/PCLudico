<script setup>
const emit = defineEmits(['click'])

const { title, image, description } = defineProps({
  title: String,
  image: String,
  description: String,
})
</script>

<template>
  <div
    class="group p-0.5 rounded-4xl bg-linear-to-b from-blue via-red to-orange transition-all duration-200 hover:-translate-y-2"
  >
    <button
      class="relative flex flex-col justify-between p-8 bg-white dark:bg-slate-900 rounded-4xl w-full h-full cursor-pointer"
      @click="emit('click')"
    >
      <div class="flex justify-center">
        <img
          v-if="image"
          :src="image"
          alt=""
          class="group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-200 xl:-mt-40"
        />
      </div>

      <div class="flex flex-col gap-2">
        <h2 class="text-2xl text-left font-semibold tracking-tight">
          {{ title }}
        </h2>

        <p
          v-if="description"
          class="text-base text-left text-gray-500 dark:text-gray-400 leading-relaxed"
        >
          {{ description }}
        </p>
      </div>
    </button>
  </div>
</template>
