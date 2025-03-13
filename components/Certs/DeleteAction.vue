<script setup>
import { toast } from "vue-sonner";
import { TrashIcon } from "lucide-vue-next";
const { domains, apiUrl } = defineProps(["domains", "apiUrl"]);

const emits = defineEmits(["change:deleted"]);
const errors = ref([]);
const isSubmitting = ref(false);
const dialogOpen = ref(false);

async function onSubmit() {
  try {
    // reset values
    errors.value = [];
    isSubmitting.value = true;
    // doing api call
    const body = { domains: [].concat(domains) };
    const resp = await useApi(apiUrl, { method: "POST", body });
    emits("change:deleted", resp);
    toast(resp?.message || resp);
    isSubmitting.value = false;
    await delay(3000);
    dialogOpen.value = false;
  } catch (error) {
    isSubmitting.value = false;
    errors.value = [error?.message];
  }
}
</script>

<template>
  <AlertDialog v-model:open="dialogOpen">
    <AlertDialogTrigger as-child>
      <HintButton
        :title="`Delete ${[].concat(domains).join(', ')}`"
        variant="outline"
        class="relative hstack size-7 rounded p-0 [&_svg]:size-4 border border-destructive text-destructive hover:text-destructive hover:bg-red-100"
      >
        <TrashIcon />
      </HintButton>
    </AlertDialogTrigger>
    <AlertDialogContent class="space-y-4">
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>This action cannot be undone. This will permanently delete this certificate and completely remove all the data from our servers.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter class="flex">
        <RotatingText v-if="isSubmitting" :delay="2000" :values="['Please Wait...', 'Loading...']" class="font-medium text-green-700" />
        <span v-else-if="errors.length > 0" class="font-medium text-red-600">{{ errors.join(" ") }}</span>
        <i class="mx-auto" />

        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction @click.prevent="onSubmit">Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
