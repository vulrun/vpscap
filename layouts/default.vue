<script setup>
defineProps({
  bgClass: { type: String, default: "bg-gray-100" },
});
</script>

<template>
  <section :class="['flex-1', bgClass]">
    <main class="w-full max-w-full md:max-w-[600px] lg:max-w-[800px] xl:max-w-[1000px] 2xl:max-w-[1200px] mx-auto">
      <slot />
    </main>
  </section>
</template>
