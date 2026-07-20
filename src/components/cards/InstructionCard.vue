<script setup>
const props = defineProps({
  step: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: true,
    default: 'purple',
    validator: (value) => ['purple', 'red', 'orange'].includes(value),
  },
})
</script>

<template>
  <div
    :class="[
      'flex rounded-full border-2 items-center gap-5 pr-5',
      props.color == 'purple' && 'border-light-purple',
      props.color == 'red' && 'border-light-red',
      props.color == 'orange' && 'border-orange',
    ]"
  >
    <div :class="['grid h-20 w-20 rounded-full justify-center items-center font-bold text-3xl',
      props.color == 'purple' && 'bg-light-purple text-purple',
      props.color == 'red' && 'bg-light-red text-red',
      props.color == 'orange' && 'bg-orange text-dark-orange',
    ]">
      {{ props.step }}
    </div>
    <slot name="text"></slot>
  </div>
</template>
