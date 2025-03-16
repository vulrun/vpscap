<script setup>
import { DotIcon } from "lucide-vue-next";

const { row, class: classes } = defineProps(["row", "class"]);
const domains = ref(row.getValue("domain").split(" "));
const hasValidSSL = computed(() => row.original?.enableSSL && row.original?.hasSSL);
</script>

<template>
  <div :class="cn('hstack', { '[&_*]:text-gray-500 opacity-40': !row?.original?.isActive }, classes)">
    <template v-for="(domain, index) of domains" :key="domain?.confId">
      <a v-if="domain !== '_'" :class="['font-semibold', hasValidSSL ? 'text-green-700' : 'text-blue-500']" :href="`${hasValidSSL ? 'https' : 'http'}://${domain}`" target="_blank">{{ domain }}</a>
      <DotIcon class="text-gray-500 size-4 mx-1" v-if="domains.length - 1 !== index" />
    </template>
  </div>
</template>
