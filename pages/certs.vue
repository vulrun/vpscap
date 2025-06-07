<script setup>
definePageMeta({ layout: "dashboard" });
import { ArrowUpDown, ChevronDown, CommandIcon, SearchIcon, PlusIcon, RefreshCwIcon, SortDesc, TrashIcon } from "lucide-vue-next";
import HoverText from "@/components/HoverText.vue";
import HintButton from "@/components/HintButton.vue";
import ConfirmAction from "@/components/ConfirmAction.vue";
import DataTableColumnHeader from "@/components/DataTable/ColumnHeader.vue";
import CertsRowExpiry from "@/components/Certs/RowExpiry.vue";
import CertsRowDomain from "@/components/Certs/RowDomain.vue";

const viewMode = useLocalRef("certs-view-mode", "monitor");
const setViewMode = (value) => (viewMode.value = value === "install" ? "install" : "monitor");

const router = useRouter();
const route = useRoute();
onMounted(() => {
  // remove all query parameters after 2secs
  setTimeout(() => router.push({ ...route, query: null }), 2000);
  // act on query value
  if (route?.query?.install) return setViewMode("install");
  if (route?.query?.monitor) return setViewMode("monitor");
});

const monitoredCerts = useApiFetch(`/api/fetch/monitoredCerts`);
const monitoredCols = [
  {
    accessorKey: "domain",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Domain" }),
    cell: ({ row }) => h("div", { class: "" }, toArray(row?.original?.domain)),
  },
  {
    accessorKey: "subject_names",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Subject Names" }),
    cell: ({ row }) => h(CertsRowDomain, { row, class: "text-gray-500 text-sm fonts-mono-inconsolata", domains: toArray(row?.original?.subject_names) }),
  },
  {
    accessorKey: "issuer",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Issuer" }),
    cell: ({ row }) => h("div", { class: "fonts-mono-ubuntu text-gray-600" }, row?.original?.issuer),
  },
  {
    accessorKey: "remarks",
    sortingFn: "alphanumeric",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Remarks" }),
    cell: ({ row }) => h(CertsRowExpiry, { row }),
  },
  { id: "expiresAt" },
  {
    id: "actions",
    cell: ({ row }) => ConfirmDeleteAction({ action: "deleteMonitoredCert", domains: toArray(row?.original?.domain), onUpdate: () => monitoredCerts.reload.value() }),
  },
];

const installedCerts = useApiFetch(`/api/fetch/installedCerts`);
const installedCols = [
  // {
  //   accessorKey: "serialNo",
  //   header: ({ column }) => h(DataTableColumnHeader, { column, title: "serialNo" }),
  //   cell: ({ row }) => h("span", { class: "font-mono" }, row?.original?.serialNo),
  // },
  {
    accessorKey: "certName",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Domain" }),
    cell: ({ row }) => h(CertsRowDomain, { row, class: "", domains: toArray(row?.original?.certName) }),
  },
  {
    accessorKey: "altNames",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Subject Names" }),
    cell: ({ row }) => h(CertsRowDomain, { row, class: "text-gray-500 text-sm fonts-mono-inconsolata", domains: toArray(row?.original?.altNames) }),
  },
  {
    accessorKey: "issuer",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Issuer" }),
    cell: ({ row }) =>
      h(HoverText, {
        class: "fonts-mono-ubuntu text-gray-600",
        innerText: `${row?.original?.issuedBy?.organizationName}, ${row?.original?.issuedBy?.countryName}`,
        hoverText: `${row?.original?.issuedBy?.commonName}, ${row?.original?.issuedBy?.organizationName}, ${row?.original?.issuedBy?.countryName}`,
        hoverClass: "",
      }),
  },
  {
    accessorKey: "remarks",
    sortingFn: "alphanumeric",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Remarks" }),
    cell: ({ row }) => h(CertsRowExpiry, { row }),
  },
  { id: "expiresAt" },
  { id: "dirName" },
  {
    id: "actions",
    cell: ({ row }) => ConfirmDeleteAction({ action: "deleteInstalledCert", domains: toArray(row?.original?.certName), onUpdate: () => installedCerts.reload.value() }),
  },
];

function ConfirmDeleteAction({ action, domains, onUpdate }) {
  const TrashButton = hx(HintButton, {
    variant: "outline",
    class: "relative hstack size-7 rounded p-0 [&_svg]:size-4 border border-red-400 text-red-400 hover:text-red-400 hover:bg-red-100",
    title: `Delete ${domains.join(", ")}`,
    _children: () => [h(TrashIcon)],
  });

  return hx(ConfirmAction, {
    action,
    actionPayload: { domains },
    "onUpdate:list": onUpdate,
    _children: () => [TrashButton],
  });
}
</script>

<template>
  <ClientOnly>
    <div class="w-full">
      <div class="flex items-start justify-between">
        <MainHeading title="SSL Certificates">Monitor or install SSL certificates for your domains</MainHeading>

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
            <CertsAddDialog apiUrl="/api/action/insertMonitoredCert" :value="route?.query?.monitor" heading="Add Monitor Certificate" @update:list="() => monitoredCerts?.reload.value()">
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
      </SimpleCard>

      <SimpleCard v-if="viewMode === 'install'" class="gap-2">
        <div class="hstack items-start justify-between">
          <div class="vstack gap-1">
            <h3 class="text-gray-700 text-md font-semibold leading-none tracking-tight">Installed Certificates</h3>
            <p class="text-gray-500 text-sm">Certificates that are installed on you vps server, ensuring secure connections for your website or application.</p>
          </div>

          <div class="hstack gap-2">
            <!-- <HintButton title="Search" variant="outline" size="sm" class="relative hstack bg-background text-muted-foreground h-10 w-10 [&_svg]:size-4" @click.prevent="alert('123456')">
            <SearchIcon />
          </HintButton> -->
            <HintButton title="Refresh" variant="outline" size="sm" class="relative hstack bg-background text-muted-foreground h-10 w-10 [&_svg]:size-4" @click.prevent="installedCerts?.reload.value">
              <RefreshCwIcon />
            </HintButton>
            <CertsAddDialog apiUrl="/api/action/createInstalledCert" :value="route?.query?.install" heading="Install Certificate" @update:list="() => installedCerts?.reload.value()">
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
  </ClientOnly>
</template>
