<script setup>
import { toast } from "vue-sonner";
import { TrashIcon, Loader2Icon } from "lucide-vue-next";
const { class: classes, confId, action, disabled, asChild } = defineProps(["class", "confId", "action", "disabled", "asChild"]);

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
    const body = { id: confId };
    const resp = await useApi(`/api/action/${action}`, { method: "POST", body });
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
    <DialogTrigger :class="cn(classes)" :disabled="disabled" v-bind="{ asChild }">
      <slot />
    </DialogTrigger>
    <DialogContent class="space-y-2">
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
      </DialogHeader>
      <div class="">This action cannot be undone and will update changes on your servers immediately.</div>
      <DialogFooter class="flex gap-2">
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
