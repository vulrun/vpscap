<script setup>
import { cn } from "@/utils/utils";

const props = defineProps(["class"]);
</script>

<template>
  <div :class="cn('rounded-lg border bg-card text-card-foreground shadow-sm p-6', props.class)">
    <slot />
  </div>
</template>
