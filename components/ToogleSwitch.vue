<script setup>
const emits = defineEmits(["update:modelValue", "change"]);
const props = defineProps(["modelValue"]);
const attrs = useAttrs();

const switchVal = computed({
  get: () => props?.modelValue == true,
  set: (val) => {
    emits("update:modelValue", val);
    emits("change", val);
  },
});
</script>

<template>
  <Switch v-bind="attrs" :checked="switchVal" @update:checked="(val) => (switchVal = val)" />
</template>
