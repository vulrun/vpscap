<script setup>
const props = defineProps(["class", "hoverClass", "innerText", "hoverText"]);
const slotHtml = useSlotAsText(null, true);
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger :class="cn(props?.class)" v-html="props?.innerText || slotHtml"></TooltipTrigger>
      <TooltipContent :class="cn(props?.hoverClass)" v-html="props?.hoverText || props?.innerText || slotHtml"></TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
