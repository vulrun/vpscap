<script setup>
import { ref } from "vue";
import { XIcon, EllipsisIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-vue-next";
import { valueUpdater } from "@/utils/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  FlexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useVueTable,
} from "@tanstack/vue-table";

const statuses = [
  //
  { label: "Active", value: "1" },
  { label: "Disabled", value: "0" },
];
const typeses = [
  //
  { label: "Serve", value: "serve" },
  { label: "Proxy", value: "proxy" },
  { label: "Redirect", value: "redirect" },
];

const props = defineProps(["data", "columns", "sorting"]);
const sorting = useLocalRef("sites-sorting", [].concat(props?.sorting).filter(Boolean));
const pagination = useLocalRef("sites-pagination", { pageIndex: 0, pageSize: 20 });
const globalFilter = useLocalRef("sites-globalFilter", "");
const columnFilters = useLocalRef("sites-columnFilters", []);
const columnVisibility = useLocalRef("sites-columnVisibility", { isActive: false });

const table = useVueTable({
  sortDescFirst: true,
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  state: {
    get sorting() {
      return sorting.value;
    },
    get pagination() {
      return pagination.value;
    },
    get globalFilter() {
      return globalFilter.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onPaginationChange: (updaterOrValue) => valueUpdater(updaterOrValue, pagination),
  onGlobalFilterChange: (updaterOrValue) => valueUpdater(updaterOrValue, globalFilter),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
});

const columns = computed(() => table.getAllColumns().filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide()));
const isFiltered = computed(() => globalFilter.value.length > 0 || table.getState().columnFilters.length > 0);
const visibleRows = computed(() => {
  const rows = table.getRowModel().rows;
  const sticky = rows.filter((row) => row.original.confName === "_default.conf");
  const others = rows.filter((row) => row.original.confName !== "_default.conf");
  return [...sticky, ...others];
});

function clearAllFilters() {
  globalFilter.value = "";
  table.resetColumnFilters();
}

onMounted(() => {
  // table.getColumn("isActive")?.setFilterValue(false);
  // table.getColumn("isActive")?.toggleVisibility(false);
  // console.log("🚀 ~ onMounted ~ columnVisibility:", columnVisibility);
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <!-- filter/search -->
      <div class="flex flex-1 items-center space-x-2">
        <Input placeholder="search here..." class="h-8 w-[150px] lg:w-[250px]" :model-value="globalFilter ?? ''" @input="globalFilter = String($event.target.value)" />
        <SitesDataFilters v-if="table.getColumn('confType')" title="Type" :column="table.getColumn('confType')" :options="typeses" />
        <SitesDataFilters v-if="table.getColumn('isActive')" title="Status" :column="table.getColumn('isActive')" :options="statuses" />
        <Button
          v-if="isFiltered"
          variant="ghost"
          class="flex items-center h-8 px-2 lg:px-3 bg-accent text-accent-foreground border border-transparent hover:border-gray-400/80"
          @click="clearAllFilters"
        >
          Reset
          <XIcon class="h-4 w-4" />
        </Button>
        <!-- <ToggleGroup type="multiple">
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <FontBoldIcon class="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <FontItalicIcon class="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline">
            <UnderlineIcon class="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup> -->
        <!-- <DataTableFacetedFilter v-if="table.getColumn('isActive')" :column="table.getColumn('isActive')" title="ACTIVE" :options="priorities" /> -->
      </div>
      <!-- view columns -->
      <DataTableViewOptions :table="table" />
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="visibleRows?.length">
            <TableRow v-for="row in visibleRows" :key="row.id" :data-state="row.getIsSelected() && 'selected'">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" :class="cn(cell.column.columnDef.cellParentClass)">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>

          <TableRow v-else>
            <TableCell :colspan="columns.length" class="aspect-video text-center">No results.</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- pagination -->
    <DataTablePagination :table="table" />
  </div>
</template>
