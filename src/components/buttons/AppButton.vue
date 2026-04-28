<script setup>
const emits = defineEmits(['onClick'])
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: false,
  },
  mode: {
    type: String,
    default: 'purple',
    validator: (value) => ['purple'].includes(value),
  },
})
</script>
<template>
  <button
    :class="[
      'w-full text-lg font-semibold border-2 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-98 active:scale-97 hover:opacity-80 active:opacity-80',
      props.mode === 'purple' && 'text-[#D599FF] bg-[#D599FF]/20 border dark:bg-[#9370FF]/20 dark:text-[#9370FF]',
    ]"
    @click="emits('onClick')"
  >
    <span v-if="props.icon" :class="props.icon"></span>
    <p>{{ props.text }}</p>
  </button>
</template>
