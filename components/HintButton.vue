<script setup>
const { title, ...attrs } = useAttrs();
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button v-bind="attrs">
          <slot />
        </Button>
      </TooltipTrigger>
      <TooltipContent v-if="title">{{ title }}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
