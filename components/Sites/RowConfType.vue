<script setup>
import { WifiZeroIcon, DotIcon, FolderOpenIcon, FolderRootIcon, FolderSymlinkIcon, BinocularsIcon } from "lucide-vue-next";
const { row, class: classes } = defineProps(["row", "class"]);
</script>

<template>
  <div :class="cn('hstack justify-start space-x-2 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-gray-400', row?.original?.isActive ? null : '[&_span]:text-gray-500 opacity-40', classes)">
    <HoverText v-if="row?.original?.confType" :hoverText="row?.original?.confType">
      <i v-if="false"></i>
      <FolderOpenIcon v-else-if="row?.original?.confType === 'serve'" />
      <FolderRootIcon v-else-if="row?.original?.confType === 'proxy'" />
      <FolderSymlinkIcon v-else-if="row?.original?.confType === 'redirect'" />
      <WifiZeroIcon v-else />
    </HoverText>

    <HoverText v-if="row.original?.hasSSLMonitor" hoverText="SSL monitoring is active">
      <BinocularsIcon />
    </HoverText>
  </div>
</template>
