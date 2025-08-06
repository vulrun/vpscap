<script setup>
import { CloudOffIcon, CloudAlertIcon, CloudFogIcon, LeafyGreenIcon } from "lucide-vue-next";

const props = defineProps(["row", "class"]);
const dateObj = computed(() => {
  return new Date(props?.row?.original?.expiresAt || props?.row?.original?.valid_to);
});
const remarksIcon = computed(() => {
  if (props?.row?.original?.isValid) return LeafyGreenIcon;
  if (props?.row?.original?.remarks?.toLowerCase()?.startsWith("domain")) return CloudAlertIcon;
  return CloudFogIcon;
});
const remarksColorClass = computed(() => {
  if (props?.row?.original?.isValid) return "text-green-800";
  if (props?.row?.original?.remarks?.toLowerCase()?.startsWith("domain")) return "text-red-700";
  return "text-amber-700";
});
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger :class="cn('flex text-left opacity-90', props?.class, remarksColorClass)">
        <component :is="remarksIcon" class="mx-2 size-4" />
        <span class="font-semibold">{{ row?.original?.remarks }}</span>
      </TooltipTrigger>
      <TooltipContent class="font-mono">{{ dateObj.valueOf() ? dateObj.toISOString() : row?.original?.remarks }}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
