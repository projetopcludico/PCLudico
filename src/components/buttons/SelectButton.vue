<script setup>
const emits = defineEmits(['select'])
const props = defineProps({
  selected: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: 'purple',
    validator: (value) => ['purple', 'red', 'orange'].includes(value),
  },
  text: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: false,
  },
})
</script>
<template>
  <button
    :class="[
      'w-full h-full text-xl text-center font-semibold border-2 rounded-lg transition-all duration-200 py-2',
      props.disabled
        ? 'opacity-50 cursor-not-allowed'
        : 'cursor-pointer hover:scale-98 active:scale-98',
      !props.disabled && {
        'bg-purple border-purple text-white dark:bg-purple-dark dark:border-purple-dark':
          props.color === 'purple' && props.selected,
        'border-purple text-purple dark:border-purple-dark dark:text-purple-dark':
          props.color === 'purple' && !props.selected,
      },
      !props.disabled && {
        'bg-red border-red text-white': props.color === 'red' && props.selected,
        'border-red text-red': props.color === 'red' && !props.selected,
      },
      !props.disabled && {
        'bg-orange border-orange text-white': props.color === 'orange' && props.selected,
        'border-orange text-orange': props.color === 'orange' && !props.selected
      },
    ]"
    :disabled="props.disabled"
    @click="!props.disabled && emits('select')"
  >
    <span v-if="props.disabled" class="text-4xl mdi mdi-lock"></span>
    <span v-else-if="props.icon" :class="['text-4xl', props.icon]"></span>
    <p>{{ props.text }}</p>
  </button>
</template>
