<script setup>
import { z } from "zod";
import { toast } from "vue-sonner";
import { LoaderCircleIcon } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { DependencyType } from "@/components/ui/auto-form/interface";

const emits = defineEmits(["update:list"]);
const props = defineProps(["class", "disabled", "conf", "asChild"]);
const conf = ref(props?.conf);
const isEdit = !!conf?.value?.confId;
const errors = ref([]);
const dialogOpen = ref(false);
const isSubmitting = ref(false);

const configTypes = ["serve", "proxy", "redirect"];
const SiteConfSchema = z.object({
  confType: z.enum(configTypes).describe("Configuration Type").default(configTypes?.[0]),
  domain: z
    .string()
    .trim()
    .describe("Domains & Aliases")
    .refine((val) => val === "_" || sanitizeDomains(val).length, { message: "Domains must be in valid format" }),
  target: z.string().trim().min(10).describe("Target Location"),
  enableIndexing: z.boolean().default(false).describe("Enable Auto Indexing"),
  enableSSL: z.boolean().default(false).describe("Enable SSL"),
  forceSSL: z.boolean().default(false).describe("Force SSL"),
});

const dependencies = [
  {
    sourceField: "confType",
    targetField: "confType",
    type: DependencyType.HIDES,
    when: () => conf?.value?.isDefault,
  },
  {
    sourceField: "domain",
    targetField: "domain",
    type: DependencyType.HIDES,
    when: () => conf?.value?.isDefault,
  },
  {
    sourceField: "confType",
    targetField: "enableIndexing",
    type: DependencyType.HIDES,
    when: (confType) => confType !== "serve",
  },
  {
    sourceField: "enableSSL",
    targetField: "forceSSL",
    type: DependencyType.HIDES,
    when: (enableSSL) => enableSSL === false,
  },
];
const fieldConfig = {
  enableIndexing: { component: "switch", label: SiteConfSchema?._getCached()?.shape?.enableIndexing?._def?.description },
  enableSSL: { component: "switch", label: SiteConfSchema?._getCached()?.shape?.enableSSL?._def?.description },
  forceSSL: { component: "switch", label: SiteConfSchema?._getCached()?.shape?.forceSSL?._def?.description },
};
const form = useForm({
  validationSchema: toTypedSchema(SiteConfSchema),
  validateOnMount: isEdit,
  keepValuesOnUnmount: isEdit,
});

onMounted(() => {
  if (isEdit) form.resetForm({ values: conf?.value });
});

async function onSubmit(formData) {
  try {
    // reset values
    errors.value = [];
    isSubmitting.value = true;
    // doing api call
    const body = { id: conf?.value?.confId, ...formData };
    const resp = await useApi(`/api/action/${isEdit ? "updateSite" : "createSite"}`, { method: "POST", body });
    // success handler
    emits("update:list");
    toast(resp?.message || resp);
    await delay(400);
    isSubmitting.value = false;
    dialogOpen.value = false;
  } catch (error) {
    isSubmitting.value = false;
    errors.value = [error?.message];
  }
}
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogTrigger v-bind="{ class: props?.class, disabled: props?.disabled, asChild: props?.asChild }">
      <slot>
        <Button class="ml-2" variant="outline">Add</Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="max-w-[95svw] max-h-[95svh] md:max-w-lg grid-rows-[auto_minmax(0,1fr)_auto]">
      <DialogHeader>
        <DialogTitle class="font-semibold text-lg">Add Site</DialogTitle>
        <DialogDescription class="hidden">Description goes here</DialogDescription>
      </DialogHeader>
      <AutoForm class="space-y-4" :schema="SiteConfSchema" :field-config="fieldConfig" :dependencies="dependencies" :form="form" @submit="onSubmit">
        <DialogFooter class="flex flex-row items-center gap-2">
          <div class="flex-1">
            <RotatingText v-if="isSubmitting" :delay="2000" class="font-medium lowercase text-sm text-green-700" />
            <span v-else-if="errors.length > 0" class="font-medium text-sm text-red-600">{{ errors.join(" ") }}</span>
          </div>
          <DialogClose as-child>
            <Button type="button" variant="secondary" class="w-20 border border-gray-300">Close</Button>
          </DialogClose>
          <Button v-if="isSubmitting" disabled class="w-20">
            <LoaderCircleIcon class="size-6 animate-spin" />
          </Button>
          <Button v-else type="submit" class="w-20">Save</Button>
        </DialogFooter>
      </AutoForm>
    </DialogContent>
  </Dialog>
</template>
