<script setup>
const props = defineProps(["class", "hoverClass", "innerText", "hoverText"]);
const slotHtml = useSlotAsHtml();
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger :class="cn(props?.class)">{{ props?.innerText || slotHtml }}</TooltipTrigger>
      <TooltipContent :class="cn(props?.hoverClass)">{{ props?.hoverText || props?.innerText || slotHtml }}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
