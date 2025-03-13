<script setup>
import { DotIcon } from "lucide-vue-next";

const { class: classes, domains } = defineProps(["class", "domains"]);
</script>

<template>
  <div :class="cn('hstack', classes)">
    <template v-for="(domain, index) of domains" :key="domain">
      <span class="text-xs">{{ domain }}</span>
      <DotIcon class="text-gray-500/50 size-4 mx-1" v-if="domains.length - 1 !== index" />
    </template>
  </div>
</template>
