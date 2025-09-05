<script setup>
const props = defineProps(["class"]);
const attrs = useAttrs();
</script>

<template>
  <label v-bind="attrs" :class="cn('block m-0', props?.class)">
    <slot />
  </label>
</template>
