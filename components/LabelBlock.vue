<script setup>
defineOptions({ inheritAttrs: false });
const { class: classes, ...attrs } = useAttrs();
</script>

<template>
  <label :class="cn('block m-0', classes)" v-bind="attrs">
    <slot />
  </label>
</template>
