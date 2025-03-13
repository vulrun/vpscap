<script setup>
import { WifiZeroIcon, DotIcon, FolderOpenIcon, FolderRootIcon, FolderSymlinkIcon } from "lucide-vue-next";
const { row, class: classes } = defineProps(["row", "class"]);

function confTypeIcon(type) {
  if (type === "serve") return FolderOpenIcon;
  if (type === "proxy") return FolderRootIcon;
  if (type === "redirect") return FolderSymlinkIcon;

  return WifiZeroIcon;
}
</script>

<template>
  <div :class="cn('hstack justify-start [&_svg]:size-4 [&_svg]:shrink-0', { '[&_span]:text-gray-500 opacity-40': !row?.original?.isActive }, classes)">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <component :is="confTypeIcon(row?.original?.confType)" class="text-gray-400 mx-2" />
        </TooltipTrigger>
        <TooltipContent>{{ row?.original?.confType }}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>
