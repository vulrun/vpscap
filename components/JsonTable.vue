<script setup>
const { class: classes, tableData: data } = defineProps(["tableData", "class"]);

const headers = computed(() => {
  const cleanData = [].concat(data).filter(Boolean);
  return cleanData.length > 0 ? Object.keys(cleanData?.[0]) : [];
});
</script>

<template>
  <div :class="cn('overflow-x-auto py-4', classes)">
    <table class="min-w-full bg-white border border-gray-300/50">
      <thead>
        <tr class="text-left bg-gray-200">
          <th class="px-4 py-2 text-sm font-semibold text-gray-900" v-for="(header, index) in headers" :key="index">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in data" :key="index" class="border-b border-gray-200">
          <td class="px-4 py-2" v-for="(column, colIndex) in Object.keys(row)" :key="colIndex">
            {{ row[column] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
