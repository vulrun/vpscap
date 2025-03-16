<script setup>
import { EllipsisIcon, FilePenLineIcon, TrashIcon, ToggleLeftIcon, ToggleRightIcon, ShieldCheckIcon, ShieldAlertIcon, Repeat1Icon, ListRestartIcon } from "lucide-vue-next";
const { row } = defineProps(["row"]);
const emits = defineEmits(["update:list"]);
const dropdownItemClass = ref(
  "relative flex cursor-pointer select-none items-center rounded-sm gap-2 px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-inherit [&>svg]:size-4 [&>svg]:shrink-0 text-xs w-full disabled:pointer-events-none disabled:opacity-20 font-medium uppercase"
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
        <SitesEditor :conf="row?.original" @update:list="emits('update:list', $event)" :class="[dropdownItemClass, 'flex']"><FilePenLineIcon />Edit</SitesEditor>
      </DropdownMenuItem>
      <DropdownMenuItem as-child>
        <!-- todo: edit similar feature -->
        <!-- <SitesEditor :class="[dropdownItemClass]" :conf="row?.original" @update:list="emits('update:list', $event)"><FilePenLineIcon class="h-4 w-4" />Edit Similar</SitesEditor> -->
      </DropdownMenuItem>
      <DropdownMenuItem as-child>
        <ConfirmAction
          :class="[dropdownItemClass, 'text-red-700']"
          :disabled="row?.original?.isDefault || row?.original?.isActive"
          :actionPayload="{ id: row?.original?.confId }"
          action="deleteSite"
          @update:list="emits('update:list', $event)"
          ><TrashIcon />Delete</ConfirmAction
        >
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem as-child>
        <ConfirmAction
          :class="[dropdownItemClass, 'text-blue-700']"
          :disabled="row?.original?.isDefault || row?.original?.isActive"
          :actionPayload="{ id: row?.original?.confId }"
          action="enableSite"
          @update:list="emits('update:list', $event)"
          ><ToggleRightIcon />Enable</ConfirmAction
        >
      </DropdownMenuItem>
      <DropdownMenuItem as-child>
        <ConfirmAction
          :class="[dropdownItemClass, 'text-red-700']"
          :disabled="row?.original?.isDefault || !row?.original?.isActive"
          :actionPayload="{ id: row?.original?.confId }"
          action="disableSite"
          @update:list="emits('update:list', $event)"
          ><ToggleLeftIcon />Disable</ConfirmAction
        >
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem as-child>
        <ConfirmAction
          :class="[dropdownItemClass, 'text-gray-700']"
          :disabled="!row?.original?.isActive"
          :actionPayload="{ id: row?.original?.confId }"
          action="rebuildSite"
          @update:list="emits('update:list', $event)"
          ><Repeat1Icon />Rebuild</ConfirmAction
        >
      </DropdownMenuItem>
      <DropdownMenuItem as-child>
        <NuxtLink :to="`/certs?monitor=${row?.original?.domain}`" as="a" :class="[dropdownItemClass, 'text-cyan-600']"><ShieldAlertIcon />Monitor SSL</NuxtLink>
      </DropdownMenuItem>
      <DropdownMenuItem as-child>
        <NuxtLink :to="`/certs?install=${row?.original?.domain}`" as="a" :class="[dropdownItemClass, 'text-green-600']"><ShieldCheckIcon />Install SSL</NuxtLink>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
