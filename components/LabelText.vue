<script setup>
const { class: classes, ...attrs } = useAttrs();
</script>

<template>
  <label
    v-bind="attrs"
    :class="
      cn(
        //
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        classes
      )
    "
  >
    <slot />
  </label>
</template>
