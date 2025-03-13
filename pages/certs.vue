<script setup>
definePageMeta({ layout: "dashboard" });
import { ArrowUpDown, ChevronDown, CommandIcon, SearchIcon, PlusIcon, RefreshCwIcon, SortDesc } from "lucide-vue-next";
import DataTableColumnHeader from "@/components/DataTable/ColumnHeader.vue";
import CertsDeleteAction from "@/components/Certs/DeleteAction.vue";
import CertsRowExpiry from "@/components/Certs/RowExpiry.vue";
import CertsRowDomain from "@/components/Certs/RowDomain.vue";

const viewMode = useLocalRef("certs-view-mode", "monitor");
function setViewMode(value) {
  viewMode.value = value === "install" ? "install" : "monitor";
}

const route = useRoute();
onMounted(() => {
  if (route?.query?.install) {
    setViewMode("install");
  } else if (route?.query?.monitor) {
    setViewMode("monitor");
  }
});

const monitoredCerts = useApiFetch(`/api/fetch/monitoredCerts`);
const monitoredCols = [
  {
    accessorKey: "domain",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Domain" }),
    cell: ({ row }) => h("div", { class: "font-mono" }, row.getValue("domain")),
  },
  {
    accessorKey: "subject_names",
    accessorFn: (row) => [].concat(row?.subject_names || ""),
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Subject Names" }),
    cell: ({ row }) => h(CertsRowDomain, { row, domains: row.getValue("subject_names") }),
  },
  {
    accessorKey: "issuer",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Issuer" }),
    cell: ({ row }) => h("div", {}, row.getValue("issuer")),
  },
  {
    accessorKey: "remarks",
    sortingFn: (rowA, rowB, columnId) => sortData({ sortOrder: "asc", stringFirst: true })(rowA?.original?.remarks, rowB.original?.remarks),
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Remarks" }),
    cell: ({ row }) => h(CertsRowExpiry, { row }),
  },
  { id: "expiresAt" },
  {
    id: "actions",
    cell: ({ row }) => h(CertsDeleteAction, { row, apiUrl: "/api/action/deleteMonitoredCert", domains: row.getValue("domain") }),
  },
];

const installedCerts = useApiFetch(`/api/fetch/installedCerts`);
const installedCols = [
  {
    accessorKey: "certName",
    accessorFn: (row) => [].concat(row?.domain || ""),
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Cert Name" }),
    cell: ({ row }) => h(CertsRowDomain, { row, class: "font-mono", domains: row.getValue("certName") }),
  },
  {
    accessorKey: "altNames",
    accessorFn: (row) => [].concat(row?.altNames || ""),
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Domains" }),
    cell: ({ row }) => h(CertsRowDomain, { row, domains: row.getValue("altNames") }),
  },
  {
    accessorKey: "remarks",
    sortingFn: (rowA, rowB, columnId) => sortData({ stringFirst: true })(rowA?.original?.remarks, rowB.original?.remarks),
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Remarks" }),
    cell: ({ row }) => h(CertsRowExpiry, { row }),
  },
  { id: "expiresAt" },
  { id: "dirName" },
  {
    id: "actions",
    cell: ({ row }) => h(CertsDeleteAction, { row, apiUrl: "/api/action/deleteInstalledCert", domains: row.getValue("certName") }),
  },
];
</script>

<template>
  <div class="w-full">
    <div class="flex items-start justify-between">
      <MainHeading title="SSL Certificates">Here&apos;s the list of certificates, you are currently managing...</MainHeading>

      <Tabs v-model="viewMode" @update:model-value="setViewMode">
        <TabsList class="h-12 border border-input bg-transparent">
          <TabsTrigger class="h-10 border-none" value="monitor">Monitored Certificates</TabsTrigger>
          <TabsTrigger class="h-10 border-none" value="install">Installed Certificates</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>

    <SimpleCard v-if="viewMode === 'monitor'" class="gap-2">
      <div class="hstack items-start justify-between">
        <div class="vstack gap-1">
          <h3 class="text-gray-700 text-md font-semibold leading-none tracking-tight">Monitored Certificates</h3>
          <p class="text-gray-500 text-sm">Stay ahead of expiration dates with timely tracking alerts for your important certificates.</p>
        </div>

        <div class="hstack gap-2">
          <HintButton title="Refresh" variant="outline" size="sm" class="relative hstack bg-background text-muted-foreground h-10 w-10 [&_svg]:size-4" @click.prevent="monitoredCerts?.reload.value">
            <RefreshCwIcon />
          </HintButton>
          <CertsAddDialog apiUrl="/api/action/insertMonitoredCert" :defaultValue="route?.query?.monitor" @update:list="() => monitoredCerts?.reload.value()">
            <HintButton title="Add Certificate" variant="outline" size="sm" class="relative hstack bg-background text-muted-foreground h-10 w-10 [&_svg]:size-4">
              <PlusIcon />
            </HintButton>
          </CertsAddDialog>
        </div>
      </div>

      <div class="py-10">
        <Skeleton v-if="monitoredCerts?.isLoading?.value" class="aspect-video" />
        <CertsDataTable v-else :data="monitoredCerts?.result?.value" :columns="monitoredCols" :sorting="[{ id: 'remarks', desc: false }]" />
      </div>
      <!-- .sort(sortData({ sortKey: 'remarks', sortOrder: 'asc', stringFirst: true })) -->
    </SimpleCard>

    <SimpleCard v-if="viewMode === 'install'" class="gap-2">
      <div class="hstack items-start justify-between">
        <div class="vstack gap-1">
          <h3 class="text-gray-700 text-md font-semibold leading-none tracking-tight">Installed Certificates</h3>
          <p class="text-gray-500 text-sm">Certificates that are installed on you vps server by certbot, ensuring secure connections for your website or application.</p>
        </div>

        <div class="hstack gap-2">
          <!-- <HintButton title="Search" variant="outline" size="sm" class="relative hstack bg-background text-muted-foreground h-10 w-10 [&_svg]:size-4" @click.prevent="alert('123456')">
            <SearchIcon />
          </HintButton> -->
          <HintButton title="Refresh" variant="outline" size="sm" class="relative hstack bg-background text-muted-foreground h-10 w-10 [&_svg]:size-4" @click.prevent="installedCerts?.reload.value">
            <RefreshCwIcon />
          </HintButton>
          <CertsAddDialog apiUrl="/api/action/createInstalledCert" :defaultValue="route?.query?.install" @update:list="() => installedCerts?.reload.value()">
            <HintButton title="Add Certificate" variant="outline" size="sm" class="relative hstack bg-background text-muted-foreground h-10 w-10 [&_svg]:size-4">
              <PlusIcon />
            </HintButton>
          </CertsAddDialog>
        </div>
      </div>

      <div class="py-10">
        <Skeleton v-if="installedCerts?.isLoading?.value" class="aspect-video" />
        <CertsDataTable v-else :data="installedCerts?.result?.value" :columns="installedCols" :sorting="[{ id: 'remarks', desc: false }]" />
      </div>
    </SimpleCard>
  </div>
</template>
