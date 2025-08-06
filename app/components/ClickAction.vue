<script setup>
import { toast } from "vue-sonner";
import { TrashIcon, Loader2Icon } from "lucide-vue-next";
defineOptions({ inheritAttrs: false });

const props = defineProps(["class", "actionPayload", "action", "disabled", "asChild"]);
const emits = defineEmits(["update:list"]);
const isSubmitting = ref(false);

async function onSubmit() {
  try {
    // reset values
    isSubmitting.value = true;
    // doing api call
    const resp = await useApi(`/api/action/${props?.action}`, { method: "POST", body: props?.actionPayload || {} });
    // success handler
    emits("update:list", resp);
    toast(resp?.message || resp);
    await delay(400);
    isSubmitting.value = false;
  } catch (error) {
    isSubmitting.value = false;
    toast(error?.message || "oops, something went wrong");
  }
}
</script>

<template>
  <div :class="['flex', props.class]" v-bind="{ disabled: props?.disabled }">
    <component :is="props?.asChild ? 'span' : 'button'" v-if="!isSubmitting" v-bind="$attrs" @click="onSubmit">
      <slot />
    </component>
    <template v-else>
      <slot name="loading" />
    </template>
  </div>
</template>
