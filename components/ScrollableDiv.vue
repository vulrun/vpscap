<script setup>
import { ref, onMounted } from "vue";
const props = defineProps(["class", "maxHeight"]);
</script>

<template>
  <div
    :class="cn('transition-all duration-300 ease-in-out relative overflow-y-auto', props?.class)"
    :style="{
      maxHeight: String(props?.maxHeight || 120) + 'px',
    }"
  >
    <slot />
  </div>
</template>
