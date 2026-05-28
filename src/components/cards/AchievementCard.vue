<script setup>
const props = defineProps({
  image: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'egypt',
    validator: (value) => ['egypt', 'animals', 'futurist'].includes(value),
  },
  unlocked: {
    type: Boolean,
    required: true,
  },
  selected: {
    type: Boolean,
    required: true,
  },
})

const typeClasses = {
  egypt: 'bg-egypt text-amber-500 border-amber-500',
  animals: 'bg-emerald-100 border-emerald-300 text-emerald-500',
  futurist: 'bg-cyan-100 border-cyan-300 text-cyan-400',
}
</script>
<template>
  <button
    :class="[
      !props.unlocked
        ? 'relative w-full p-2 rounded-xl border-2 cursor-not-allowed'
        : 'relative w-full p-2 rounded-xl border-2 cursor-pointer',
      typeClasses[props.type],
      props.selected && '',
    ]"
    :disabled="!props.unlocked"
  >
    <div
      v-if="!props.unlocked"
      class="absolute inset-0 z-10 flex items-center justify-center bg-black/90 rounded-xl"
    >
      <span class="mdi mdi-lock text-white text-2xl"></span>
    </div>
    <img v-if="props.image" :src="props.image" alt="achievement-image" />
    <p class="text-lg truncate">{{ props.name }}</p>
  </button>
</template>
