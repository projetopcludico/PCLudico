<script setup>
const emit = defineEmits(['click'])
const props = defineProps({
  text: {
    type: String,
    required: false,
  },
  icon: {
    type: String,
    required: false,
  },
  mode: {
    type: String,
    default: 'purple',
    validator: (value) => ['purple', 'orange', 'red', 'blue'].includes(value),
  },
})
</script>
<template>
  <button
    :class="[
      'w-full text-lg font-semibold px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-98 active:scale-97 hover:opacity-80 active:opacity-80',
      props.mode === 'purple' && 'text-white bg-purple dark:bg-purple-dark',
      props.mode === 'orange' && 'text-white bg-orange',
      props.mode === 'red' && 'text-white bg-red',
      props.mode === 'blue' && 'text-white bg-blue',
    ]"
    @click="emit('click')"
  >
    <span v-if="props.icon" :class="props.icon"></span>
    <p v-if="props.text" class="text-2xl font-sour-gummy uppercase">{{ props.text }}</p>
  </button>
</template>
