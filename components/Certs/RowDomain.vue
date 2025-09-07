<script setup>
defineOptions({ inheritAttrs: false });

const props = defineProps(["class", "domains"]);
</script>

<template>
  <ScrollableDiv :class="cn(props?.class)">
    <template v-for="(domain, index) of props?.domains" :key="domain">
      <span class="text-sm">{{ domain }}</span>
      <!-- <DotIcon class="text-gray-500/50 size-4 mx-1" v-if="domains.length - 1 !== index" /> -->
    </template>
  </ScrollableDiv>
</template>
