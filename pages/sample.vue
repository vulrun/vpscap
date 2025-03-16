<script setup>
definePageMeta({ layout: "dashboard" });
</script>

<template>
  <div class="flex flex-1 flex-col p-4 gap-4">
    <div class="grid auto-rows-min gap-4 md:grid-cols-3">
      <div class="aspect-video rounded-xl bg-zinc-200" />
      <div class="aspect-video rounded-xl bg-zinc-200" />
      <div class="aspect-video rounded-xl bg-zinc-200" />
    </div>
    <div class="grid auto-rows-min gap-4 md:grid-cols-2">
      <div class="aspect-video rounded-xl bg-zinc-200" />
      <div class="aspect-video rounded-xl bg-zinc-200" />
    </div>
  </div>
</template>
