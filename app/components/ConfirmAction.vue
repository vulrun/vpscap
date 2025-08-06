<script setup>
import { toast } from "vue-sonner";
import { TrashIcon, Loader2Icon } from "lucide-vue-next";
const props = defineProps(["class", "actionPayload", "action", "disabled", "asChild", "title", "description"]);
const emits = defineEmits(["update:list"]);
const errors = ref([]);
const isSubmitting = ref(false);
const dialogOpen = ref(false);

async function onSubmit() {
  try {
    // reset values
    errors.value = [];
    isSubmitting.value = true;
    // doing api call
    const resp = await useApi(`/api/action/${props?.action}`, { method: "POST", body: props?.actionPayload || {} });
    // success handler
    emits("update:list", resp);
    toast(resp?.message || resp);
    await delay(400);
    isSubmitting.value = false;
    dialogOpen.value = false;
  } catch (error) {
    isSubmitting.value = false;
    errors.value = [error?.message];
    toast(error?.message || "oops, something went wrong");
  }
}
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogTrigger :class="cn(props?.class)" :disabled="props?.disabled" v-bind="{ asChild: props?.asChild }">
      <slot />
    </DialogTrigger>
    <DialogContent class="space-y-0 [&_button.absolute]:hidden" :disableOutsidePointerEvents="true">
      <DialogTitle class="leading-normal tracking-normal">{{ props?.title || "Are you absolutely sure?" }}</DialogTitle>
      <div
        class="text-justify text-sm text-muted-foreground leading-5"
        v-html="props?.description || 'Warning: These changes are permanent. Once you hit <b>Continue</b>, there\'s no undo button. Think twice before you act!'"
      />
      <DialogFooter class="flex gap-2 pt-4">
        <RotatingText v-if="isSubmitting" :delay="2000" class="text-sm font-medium text-green-700" />
        <span v-else-if="errors.length > 0" class="text-sm font-medium text-red-600">{{ errors.join(" ") }}</span>
        <i class="mx-auto"></i>

        <Button type="button" variant="secondary" class="border border-gray-300" @click.prevent="dialogOpen = false">Cancel</Button>
        <Button v-if="!isSubmitting" type="button" variant="primary" class="bg-gray-800 text-white" @click.prevent="onSubmit">Continue</Button>
        <Button v-else disabled variant="primary" class="relative bg-gray-800 text-white">
          <i class="opacity-0">Continue</i>
          <Loader2Icon class="size-4 animate-spin absolute" />
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
