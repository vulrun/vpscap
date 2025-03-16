<script setup>
const props = defineProps(["title", "brief"]);
const slotHtml = useSlotAsHtml();
</script>

<template>
  <div class="vstack relative mb-8">
    <h2 class="text-2xl font-semibold tracking-normal">{{ props?.title }}</h2>
    <p class="text-muted-foreground">{{ slotHtml || props?.brief }}</p>
  </div>
</template>
