<script setup>
import { DotIcon } from "lucide-vue-next";

const { class: classes, domains } = defineProps(["class", "domains"]);
</script>

<template>
  <ScrollableDiv :class="cn('vstack', classes)">
    <template v-for="(domain, index) of domains" :key="domain">
      <span class="text-sm">{{ domain }}</span>
      <!-- <DotIcon class="text-gray-500/50 size-4 mx-1" v-if="domains.length - 1 !== index" /> -->
    </template>
  </ScrollableDiv>
</template>
