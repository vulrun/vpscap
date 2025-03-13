<script setup>
const { row, class: classes } = defineProps(["row", "class"]);
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <span class="text-slate-800">{{ row?.original?.remarks }}</span>
      </TooltipTrigger>
      <TooltipContent class="font-mono">{{ new Date(row?.original?.expiresAt || row?.original?.valid_to) }}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
