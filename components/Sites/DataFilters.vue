<script setup>
import { computed } from "vue";
import { cn } from "@/lib/utils";
import { CheckIcon, CircleFadingPlusIcon } from "lucide-vue-next";

const props = defineProps(["column", "title", "options"]);
const selectedValues = computed(() => new Set(props.column?.getFilterValue()));
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="sm" class="h-8 border-dashed">
        <CircleFadingPlusIcon class="mr-2 h-4 w-4" />
        {{ title }}
        <template v-if="selectedValues.size > 0">
          <Separator orientation="vertical" class="mx-2 h-4" />
          <Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden"> {{ selectedValues.size }} </Badge>
          <div class="hidden space-x-1 lg:flex">
            <Badge v-if="selectedValues.size > 2" variant="secondary" class="rounded-sm px-1 font-normal">{{ selectedValues.size }} selected</Badge>
            <template v-else>
              <Badge v-for="option in options.filter((option) => selectedValues.has(option.value))" :key="option.value" variant="secondary" class="rounded-sm px-1 font-normal">
                {{ option.label }}
              </Badge>
            </template>
          </div>
        </template>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>{{ title }}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <!-- <DropdownMenuCheckboxItem v-model:checked="showStatusBar">Active</DropdownMenuCheckboxItem> -->
      <!-- <DropdownMenuCheckboxItem v-model:checked="showPanel">Disabled</DropdownMenuCheckboxItem> -->

      <DropdownMenuItem
        v-for="option in options"
        :key="option?.value"
        @click.prevent="
          (e) => {
            const valueStr = typeof option?.value === 'string' ? option?.value : JSON.stringify(option?.value);

            // const isSelected = selectedValues.has(valueStr);
            // if (isSelected) selectedValues.delete(valueStr);
            // else selectedValues.add(valueStr);

            selectedValues.clear();
            selectedValues.add(valueStr);

            // const filterValues = [];
            // console.log('🚀 ~ filterValues:', filterValues);
            column?.setFilterValue([...selectedValues]);
          }
        "
      >
        <div
          :class="
            cn(
              'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
              selectedValues.has(option?.value) ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
            )
          "
        >
          <CheckIcon class="h-4 w-4" />
        </div>
        <component :is="option?.icon" v-if="option?.icon" class="mr-2 h-4 w-4 text-muted-foreground" />
        <span>{{ option?.label }}</span>
        <!-- <span v-if="facets?.get(option?.value)" class="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
          {{ facets.get(option?.value) }}
        </span> -->
      </DropdownMenuItem>

      <template v-if="selectedValues.size > 0">
        <DropdownMenuSeparator />
        <DropdownMenuItem :value="{ label: 'Clear filters' }" class="justify-center text-center" @select="column?.setFilterValue(undefined)">Clear filters</DropdownMenuItem>
      </template>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
