<script setup>
const { step_key, steps, active_step } = defineProps(["step_key", "steps", "active_step"]);
const step_idx = computed(() => Object.keys(steps).indexOf(step_key));
</script>

<template>
  <div v-if="active_step === step_idx" class="flex flex-col space-y-4 text-md [&_p]:text-justify [&_p]:text-gray-700">
    <span class="text-2xl font-bold mb-3 pb-3 border-b">{{ steps?.[step_key] }}</span>
    <slot></slot>
  </div>
</template>
