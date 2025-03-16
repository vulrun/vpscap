<script setup>
import { toast } from "vue-sonner";
import { LoaderCircleIcon } from "lucide-vue-next";

const props = defineProps(["apiUrl", "value", "heading"]);
const emits = defineEmits(["update:list"]);
const errors = ref([]);
const dialogOpen = ref(props?.value ? true : false);
const isSubmitting = ref(false);
const inputDomain = ref(props?.value || "");
const computedDomains = computed(() => sanitizeDomains(inputDomain?.value));

async function onSubmit() {
  try {
    // reset values
    errors.value = [];
    isSubmitting.value = true;
    // doing api call
    const body = { domains: computedDomains?.value };
    const resp = await useApi(props?.apiUrl, { method: "POST", body });
    emits("update:list", resp);
    toast(resp?.message || resp);
    isSubmitting.value = false;
    await delay(400);
    dialogOpen.value = false;
  } catch (error) {
    isSubmitting.value = false;
    errors.value = [error?.message];
  }
}
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogTrigger as-child>
      <slot>
        <Button class="ml-2" variant="outline">Add</Button>
      </slot>
    </DialogTrigger>
    <DialogContent as-child class="max-w-[95svw] max-h-[95svh] md:max-w-lg grid-rows-[auto_minmax(0,1fr)_auto]">
      <form @submit.prevent="onSubmit">
        <DialogHeader>
          <DialogTitle>{{ props?.heading || "Add Certficate" }}</DialogTitle>
        </DialogHeader>
        <div class="vstack my-2 gap-2">
          <label for="domains" class="text-sm font-medium">Enter Domain(s)</label>
          <Input id="domains" v-model="inputDomain" type="text" class="text-md" />
        </div>
        <div class="vstack my-2 gap-2">
          <span class="font-semibold text-sm">Validated Domain(s):</span>
          <div class="flex-1 hstack gap-2">
            <span class="font-normal text-xs tracking-wider rounded bg-gray-600 text-white px-1.5 h-5" v-for="dom of computedDomains">{{ dom }}</span>
          </div>
        </div>
        <DialogFooter class="flex">
          <RotatingText v-if="isSubmitting" :delay="2000" :values="['Please Wait...', 'Loading...']" class="font-medium text-green-700" />
          <span v-else-if="errors.length > 0" class="font-medium text-red-600">{{ errors.join(" ") }}</span>
          <i class="mx-auto" />
          <DialogClose as-child>
            <Button type="button" variant="secondary" class="w-20">Close</Button>
          </DialogClose>
          <Button v-if="isSubmitting" disabled class="w-20">
            <LoaderCircleIcon class="size-6 animate-spin" />
          </Button>
          <Button v-else type="submit" class="w-20">Save</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
