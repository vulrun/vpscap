<script setup>
import { cn } from "@/utils/utils";
import { ArrowDownIcon, ArrowUpIcon, ArrowDownUpIcon, EyeOffIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const { column, title } = defineProps(["column", "title"]);
const attrs = useAttrs();
</script>

<template>
  <div v-if="!column.getCanSort()" :class="attrs.class">
    {{ title }}
  </div>
  <div v-else :class="cn('flex items-center space-x-2', attrs.class ?? '')">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" size="sm" class="-ml-3 h-8 data-[state=open]:bg-accent">
          <span>{{ title }}</span>
          <ArrowDownIcon v-if="column.getIsSorted() === 'desc'" class="ml-2 h-4 w-4" />
          <ArrowUpIcon v-else-if="column.getIsSorted() === 'asc'" class="ml-2 h-4 w-4" />
          <ArrowDownUpIcon v-else class="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem @click.prevent="column.toggleSorting(false)">
          <ArrowUpIcon class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem @click.prevent="column.toggleSorting(true)">
          <ArrowDownIcon class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Desc
        </DropdownMenuItem>
        <!-- <DropdownMenuSeparator />
        <DropdownMenuItem @click.prevent="column.toggleVisibility(false)">
          <EyeOffIcon class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Hide
        </DropdownMenuItem> -->
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
