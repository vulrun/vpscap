<script setup>
import { RefreshCwIcon } from "lucide-vue-next";
const { title, fetch } = defineProps(["title", "fetch"]);
</script>

<template>
  <SimpleCard class="relative">
    <div class="hstack justify-between pb-4">
      <span class="text-md font-medium uppercase">{{ title }}</span>
      <Button variant="ghost" class="absolute top-0 right-0 m-5 size-8 p-0 border border-gray-300 text-gray-600 [&_svg]:size-4" @click.prevent="fetch?.reload?.value()">
        <RefreshCwIcon />
      </Button>
    </div>

    <Skeleton v-if="fetch?.isLoading?.value" class="w-full h-40" />
    <JsonTable v-else-if="fetch?.result?.value.length" class="text-xs font-mono" :tableData="fetch?.result?.value" />
    <p v-else class="text-sm text-muted-foreground">{{ JSON.stringify(fetch?.result?.value) }}</p>
  </SimpleCard>
</template>
