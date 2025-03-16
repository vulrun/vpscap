<script setup>
import { cn } from "@/utils/utils";

const props = defineProps(["class", "delay", "values"]);
const values = ref([]);
const currentIndex = ref(0);
const intervalDelay = ref(props?.delay || 400);
const updateInterval = ref(null);

// Clean up the interval when the component is unmounted
onMounted(() => {
  values.value = props?.values
    ? [].concat(props?.values)
    : [
        "Please Wait...",
        "Loading...",
        "Processing...",
        "Almost There...",
        "Fetching Data...",
        "Preparing...",
        "Just a Moment...",
        "Hold On...",
        "Please Stand By...",
        "Setting Up...",
        "Updating...",
        "Please Be Patient...",
      ];

  updateInterval.value = setInterval(() => {
    currentIndex.value = Math.abs((currentIndex.value + 1) % values.value.length);
  }, intervalDelay.value);

  onUnmounted(() => {
    clearInterval(updateInterval.value);
  });
});
</script>

<template>
  <div v-if="values.length > 0" :class="cn('', props.class)">
    <span>{{ values[currentIndex] }}</span>
  </div>
  <div v-else :class="cn('', props.class)">
    <slot />
  </div>
</template>
