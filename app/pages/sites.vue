<script setup>
definePageMeta({ layout: "dashboard" });
import { ArrowUpDown, ChevronDown, CommandIcon, SearchIcon, PlusIcon, RefreshCwIcon, ReplaceAllIcon } from "lucide-vue-next";
import HoverText from "@/components/HoverText.vue";
import DataTableColumnHeader from "@/components/DataTable/ColumnHeader.vue";
import SitesRowDomain from "@/components/Sites/RowDomain.vue";
import SitesRowActions from "@/components/Sites/RowActions.vue";
import SitesRowConfType from "@/components/Sites/RowConfType.vue";

const availableSites = useApiFetch(`/api/fetch/availableSites`);
const availableSiteCols = [
  {
    id: "isActive",
    accessorFn: (row) => (row?.isActive === true ? "1" : "0"),
    enableHiding: false,
  },
  {
    accessorKey: "confType",
    header: "",
    cell: ({ row }) => h(SitesRowConfType, { row }),
    enableHiding: false,
  },
  {
    accessorKey: "confName",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Configuration" }),
    cell: ({ row }) => h("div", { class: ["font-mono text-xs text-gray-500 truncate w-[160px]", { "opacity-40": !row?.original?.isActive }] }, row?.original?.confName),
  },
  {
    accessorKey: "domain",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Domains" }),
    cell: ({ row }) => h(SitesRowDomain, { row, class: "font-mono font-medium text-xs truncate w-[180px]" }),
  },
  {
    accessorKey: "target",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Target" }),
    cell: ({ row }) =>
      h(HoverText, {
        class: cn(["font-mono text-left text-xs text-pink-600 truncate w-[320px]", { "text-gray-500 opacity-40": !row?.original?.isActive }]),
        innerText: row?.original?.target,
        hoverText: row?.original?.target,
        hoverClass: "",
      }),
  },
  {
    id: "actions",
    cell: ({ row }) => h(SitesRowActions, { row, "onUpdate:list": () => availableSites.reload.value() }),
  },
];
</script>

<template>
  <div class="w-full h-full flex-1">
    <div class="hstack items-start justify-between">
      <MainHeading title="Web Sites">Manage or customize configuration files for your websites.</MainHeading>

      <div class="flex gap-2">
        <HintButton title="Refresh" variant="outline" size="sm" class="relative hstack bg-background text-muted-foreground h-10 w-10 [&_svg]:size-4" @click.prevent="availableSites?.reload.value">
          <RefreshCwIcon />
        </HintButton>
        <SitesEditor @update:list="() => availableSites?.reload.value()" asChild>
          <HintButton title="Add Site" variant="outline" size="sm" class="relative hstack bg-background text-muted-foreground h-10 w-10 [&_svg]:size-4">
            <PlusIcon />
          </HintButton>
        </SitesEditor>
        <ConfirmAction :class="['text-gray-700']" action="rebuildAllSites" @update:list="() => availableSites?.reload.value()" title="Are you sure to rebuild all site configurations?" asChild>
          <HintButton title="Rebuild All" variant="outline" size="sm" class="relative hstack bg-background text-muted-foreground h-10 w-10 [&_svg]:size-4">
            <ReplaceAllIcon />
          </HintButton>
        </ConfirmAction>
      </div>
    </div>

    <SimpleCard class="gap-2">
      <Skeleton v-if="availableSites?.isLoading?.value" class="aspect-video" />
      <SitesDataTable v-else :data="availableSites?.result?.value" :columns="availableSiteCols" :sorting="[{ id: 'confName', desc: false }]" />
    </SimpleCard>
  </div>
</template>
