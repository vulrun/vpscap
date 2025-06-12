<script setup>
import { RefreshCwIcon, TrashIcon, Loader2Icon } from "lucide-vue-next";
const { row, viewMode } = defineProps(["row", "viewMode"]);
const emits = defineEmits(["update:list"]);
const isMonitored = computed(() => viewMode.value === "monitor");
const isInstalled = computed(() => viewMode.value === "install");
</script>
<template>
  <div class="hstack space-x-2 mx-auto">
    <ClickAction
      asChild
      v-if="isMonitored"
      @update:list="emits('update:list', $event)"
      action="refreshMonitoredCert"
      :actionPayload="{
        domains: toArray(row?.original?.domain),
      }"
    >
      <HintButton
        class="relative hstack size-7 rounded p-0 [&_svg]:size-4 border border-green-600 text-green-600 hover:text-green-600 hover:bg-green-100 opacity-80"
        variant="outline"
        :title="`Refresh ${row?.original?.domain}`"
      >
        <RefreshCwIcon />
      </HintButton>
      <template #loading>
        <Button class="relative hstack size-7 rounded p-0 [&_svg]:size-4 border border-gray-600 text-gray-600 hover:text-gray-600 hover:bg-gray-200 opacity-80" variant="outline">
          <Loader2Icon class="size-4 animate-spin absolute" />
        </Button>
      </template>
    </ClickAction>

    <ConfirmAction
      asChild
      @update:list="emits('update:list', $event)"
      :title="`Are you sure to delete \`${isMonitored ? row?.original?.domain : isInstalled ? row?.original?.dirName : null}\` certificate?`"
      :action="isMonitored ? 'deleteMonitoredCert' : isInstalled ? 'deleteInstalledCert' : null"
      :actionPayload="{
        domains: isMonitored ? toArray(row?.original?.domain) : isInstalled ? toArray(row?.original?.dirName) : null,
      }"
    >
      <HintButton
        class="relative hstack size-7 rounded p-0 [&_svg]:size-4 border border-red-400 text-red-400 hover:text-red-400 hover:bg-red-100"
        variant="outline"
        :title="`Delete ${row?.original?.domain}`"
      >
        <TrashIcon />
      </HintButton>
    </ConfirmAction>
  </div>
</template>
