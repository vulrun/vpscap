<script setup>
import { RefreshCwIcon } from "lucide-vue-next";
const { icon, title, fetch } = defineProps(["title", "icon", "fetch"]);
</script>

<template>
  <SimpleCard class="relative group">
    <div class="hstack justify-between pb-2">
      <span class="text-md font-medium">{{ title }}</span>
      <Button variant="ghost" class="hidden group-hover:flex absolute top-0 right-0 m-5 size-8 p-0 border border-gray-300 text-gray-600 [&_svg]:size-4" @click.prevent="fetch.reload.value()">
        <RefreshCwIcon />
      </Button>
      <component :is="icon" class="flex group-hover:hidden size-6 text-gray-600" />
    </div>
    <Skeleton v-if="fetch?.isLoading?.value" class="h-4 w-full" />
    <p v-else class="text-sm text-muted-foreground">{{ fetch?.result?.value }}</p>
  </SimpleCard>
</template>
