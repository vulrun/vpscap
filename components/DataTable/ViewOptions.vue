<script setup>
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { EllipsisIcon } from "lucide-vue-next";
import { computed } from "vue";

const props = defineProps(["table"]);
const columns = computed(() => props.table.getAllColumns().filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide()));

function getColumnDisplayName(column) {
  try {
    if (typeof column?.columnDef?.header === "function") {
      const colTitle = column?.columnDef?.header({ column })?.props?.title;
      if (!colTitle) throw new Error("fallback to catch");
      return colTitle;
    }
    if (typeof column?.columnDef?.header === "string" && column?.columnDef?.header.length) {
      return column?.columnDef?.header;
    }

    throw new Error("fallback to catch");
  } catch (error) {
    return column?.columnDef?.displayName || column?.id;
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="sm" class="ml-auto hidden h-8 lg:flex">
        <EllipsisIcon class="mr-2 h-4 w-4" />
        View
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[150px]">
      <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuCheckboxItem v-for="column in columns" :key="column.id" classss="capitalize" :checked="column.getIsVisible()" @update:checked="(value) => column.toggleVisibility(!!value)">
        {{ getColumnDisplayName(column) }}
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
