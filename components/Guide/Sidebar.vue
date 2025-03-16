<script setup>
import { CheckIcon } from "lucide-vue-next";
const props = defineProps(["class", "steps", "statuses", "active_step", "onUpdate"]);
</script>

<template>
  <ol :class="cn(['mb-6 md:mr-6 pb-6 md:pr-6 border-b md:border-b-0 md:border-r border-gray-400/50 space-y-3', props?.class])">
    <li
      v-for="(stepVal, stepKey, stepIdx) in props?.steps"
      :key="stepKey"
      :class="cn(['hstack cursor-pointer transition-all space-x-4 p-3 rounded-md border border-transparent text-gray-600', { 'bg-gray-500/10 border-zinc-800/20': props?.active_step === stepIdx }])"
      @click.prevent="props?.onUpdate(stepIdx)"
    >
      <div v-if="props?.statuses?.[stepKey] === true" class="malign grow-0 shrink-0 leading-normal size-7 border border-green-700 rounded-full text-white bg-green-700">
        <CheckIcon class="size-4" />
      </div>
      <div v-else class="malign grow-0 shrink-0 leading-normal size-7 border-2 border-gray-400 rounded-full text-sm font-mono font-semibold">{{ stepIdx + 1 }}</div>
      <span class="text-lg font-semibold">{{ stepVal }}</span>
    </li>
  </ol>
</template>
