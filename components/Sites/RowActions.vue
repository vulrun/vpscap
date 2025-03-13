<script setup>
import { EllipsisIcon, FilePenLineIcon, TrashIcon, ToggleLeftIcon, ToggleRightIcon, ShieldCheckIcon, ShieldAlertIcon, Repeat1Icon, ListRestartIcon } from "lucide-vue-next";
const { row } = defineProps(["row"]);
const emits = defineEmits(["update:list"]);
const dropdownItemClass = ref(
  "relative flex cursor-pointer select-none items-center rounded-sm gap-2 px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0 text-xs w-full disabled:pointer-events-none disabled:opacity-20 font-medium uppercase"
);
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" :class="['flex h-8 w-8 p-0 data-[state=open]:bg-muted', { 'opacity-40': !row?.original?.isActive }]">
        <EllipsisIcon class="h-4 w-4" />
        <span class="sr-only">Open Menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[160px]">
      <DropdownMenuItem as-child>
        <SitesEditor :conf="row?.original" @update:list="emits('update:list', $event)" :class="[dropdownItemClass, 'flex']"><FilePenLineIcon class="size-4" />Edit</SitesEditor>
      </DropdownMenuItem>
      <DropdownMenuItem as-child>
        <!-- todo: edit similar feature -->
        <!-- <SitesEditor :class="[dropdownItemClass]" :conf="row?.original" @update:list="emits('update:list', $event)"><FilePenLineIcon class="h-4 w-4" />Edit Similar</SitesEditor> -->
      </DropdownMenuItem>
      <DropdownMenuItem as-child>
        <SitesConfirmAction
          :class="[dropdownItemClass, 'text-red-700']"
          :disabled="row?.original?.isDefault || row?.original?.isActive"
          :confId="row?.original?.confId"
          action="deleteSite"
          @update:list="emits('update:list', $event)"
          ><TrashIcon class="h-4 w-4" />Delete</SitesConfirmAction
        >
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem as-child>
        <SitesConfirmAction
          :class="[dropdownItemClass, 'text-blue-700']"
          :disabled="row?.original?.isDefault || row?.original?.isActive"
          :confId="row?.original?.confId"
          action="enableSite"
          @update:list="emits('update:list', $event)"
          ><ToggleRightIcon class="h-4 w-4" />Enable</SitesConfirmAction
        >
      </DropdownMenuItem>
      <DropdownMenuItem as-child>
        <SitesConfirmAction
          :class="[dropdownItemClass, 'text-red-700']"
          :disabled="row?.original?.isDefault || !row?.original?.isActive"
          :confId="row?.original?.confId"
          action="disableSite"
          @update:list="emits('update:list', $event)"
          ><ToggleLeftIcon class="h-4 w-4" />Disable</SitesConfirmAction
        >
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem as-child>
        <SitesConfirmAction
          :class="[dropdownItemClass, 'text-gray-700']"
          :disabled="!row?.original?.isActive"
          :confId="row?.original?.confId"
          action="rebuildSite"
          @update:list="emits('update:list', $event)"
          ><Repeat1Icon class="h-4 w-4" />Rebuild</SitesConfirmAction
        >
      </DropdownMenuItem>
      <DropdownMenuItem as-child>
        <NuxtLink :to="`/certs?monitor=${row?.original?.domain}`" as="a" :class="[dropdownItemClass, 'text-cyan-600']" :disabled="row?.original?.isDefault"
          ><ShieldAlertIcon class="h-4 w-4" />Monitor SSL</NuxtLink
        >
      </DropdownMenuItem>
      <DropdownMenuItem as-child>
        <NuxtLink :to="`/certs?install=${row?.original?.domain}`" as="a" :class="[dropdownItemClass, 'text-green-600']" :disabled="row?.original?.isDefault"
          ><ShieldCheckIcon class="h-4 w-4" />Install SSL</NuxtLink
        >
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
