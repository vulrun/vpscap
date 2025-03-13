<script setup>
import { ClipboardIcon, ClipboardPasteIcon } from "lucide-vue-next";

const props = defineProps(["textToCopy"]);
const slotData = useSlotAsHtml();

const buttonIcon = ref(ClipboardIcon);
const textToCopy = ref(props?.textToCopy || slotData);

const copyToClipboard = () => {
  navigator.clipboard
    .writeText(textToCopy.value)
    .then(() => {
      buttonIcon.value = ClipboardPasteIcon;
      setTimeout(() => (buttonIcon.value = ClipboardIcon), 1000);
    })
    .catch((err) => console.error("Failed to copy text: ", err));
};
</script>

<template>
  <div class="flex items-center justify-between rounded-lg shadow-inner border border-gray-300 px-4 py-2 font-mono text-sm bg-gray-50">
    {{ textToCopy }}
    <Button variant="outline" @click="copyToClipboard" class="rounded px-3 py-1 ml-2 -mr-2">
      <component :is="buttonIcon" class="size-4" />
    </Button>
  </div>
</template>
