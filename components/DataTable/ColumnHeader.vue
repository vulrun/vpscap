<script setup>
import { ArrowDownIcon, ArrowUpIcon, ArrowDownUpIcon, EyeOffIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const props = defineProps(["class", "column", "title"]);
</script>

<template>
  <div v-if="!props.column.getCanSort()" :class="props.class">
    {{ props.title }}
  </div>
  <div v-else :class="cn('flex items-center space-x-2', props.class ?? '')">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" size="sm" class="-ml-3 h-8 data-[state=open]:bg-accent">
          <span>{{ title }}</span>
          <ArrowDownIcon v-if="props.column.getIsSorted() === 'desc'" class="ml-2 h-4 w-4" />
          <ArrowUpIcon v-else-if="props.column.getIsSorted() === 'asc'" class="ml-2 h-4 w-4" />
          <ArrowDownUpIcon v-else class="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem @click.prevent="props.column.toggleSorting(false)">
          <ArrowUpIcon class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem @click.prevent="props.column.toggleSorting(true)">
          <ArrowDownIcon class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Desc
        </DropdownMenuItem>
        <!-- <DropdownMenuSeparator />
        <DropdownMenuItem @click.prevent="props.column.toggleVisibility(false)">
          <EyeOffIcon class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Hide
        </DropdownMenuItem> -->
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
