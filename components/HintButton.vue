<script setup>
const props = defineProps(["title"]);
const attrs = useAttrs();
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button v-bind="attrs">
          <slot />
        </Button>
      </TooltipTrigger>
      <TooltipContent v-if="props?.title">{{ props?.title }}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
