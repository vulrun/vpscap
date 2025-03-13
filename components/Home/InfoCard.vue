<script setup>
import { RefreshCwIcon } from "lucide-vue-next";
const { title, fetch } = defineProps(["title", "fetch"]);
</script>

<template>
  <SimpleCard class="relative">
    <div class="hstack justify-between pb-4">
      <span class="text-md font-medium uppercase">{{ title }}</span>
      <div class="absolute top-0 right-0 m-5 flex gap-2">
        <Dialog v-if="fetch?.result?.value?.length > 6">
          <DialogTrigger class="opacity-75">
            <Button variant="outline" size="sm" class="ml-auto text-xs">view all...</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{{ title }}</DialogTitle>
            </DialogHeader>
            <ul class="divide-y divide-gray-50 text-sm">
              <li class="py-1.5 flex items-center justify-between text-sm" v-for="item of fetch.result.value" :key="item?.label">
                <span class="shrink-0 text-left opacity-70">{{ item?.label }}</span>
                <span class="shrink-1 text-right font-medium font-mono" v-html="item?.value"></span>
              </li>
            </ul>
          </DialogContent>
        </Dialog>

        <Button variant="ghost" class="size-8 p-0 border border-gray-300 text-gray-600 [&_svg]:size-4" @click.prevent="fetch.reload.value()">
          <RefreshCwIcon />
        </Button>
      </div>
    </div>
    <div v-if="fetch.isLoading.value" class="divide-y divide-gray-50 space-y-4">
      <Skeleton class="h-4 w-full" />
      <Skeleton class="h-4 w-full" />
      <Skeleton class="h-4 w-full" />
      <Skeleton class="h-4 w-full" />
    </div>
    <ul v-else class="divide-y divide-gray-50 text-sm">
      <li class="py-1.5 flex items-center justify-between" v-for="item of fetch?.result?.value.slice(0, 6)" :key="item?.label">
        <span class="shrink-0 text-left opacity-70">{{ item?.label }}</span>
        <span class="shrink-1 text-right font-medium font-mono" v-html="item?.value"></span>
      </li>
    </ul>
  </SimpleCard>
</template>
