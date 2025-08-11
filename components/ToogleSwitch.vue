<script setup>
const emits = defineEmits(["update:modelValue", "change"]);
const { modelValue, ...attrs } = useAttrs();

const switchVal = ref(modelValue == true ? true : false);
const onChange = (val) => {
  switchVal.value = val;
  emits("update:modelValue", switchVal.value);
  emits("change", switchVal.value);
};
</script>

<template>
  <Switch v-bind="attrs" :checked="switchVal" @update:checked="onChange" />
</template>
