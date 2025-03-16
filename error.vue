<script setup>
import errorImage from "./assets/images/404.svg?raw";

const { error } = defineProps(["error"]);
console.log("🚀 ~ error:", error, error?.stack);
const errorMessage = error?.message || error?.statusMessage || error?.statusText || "oops, something went wrong";
</script>

<template>
  <NuxtLayout name="default">
    <!-- <a class="w-full h-full max-w-[600px] mx-auto flex items-center justify-center [&_svg]:w-full" href="/" v-html="errorImage" /> -->
    <div class="w-full h-full max-w-[600px] mx-auto">
      <div class="flex items-center justify-center [&_svg]:w-full" v-html="errorImage"></div>

      <div class="vstack">
        <h1 class="text-xl font-bold">Error occurred!</h1>
        <p v-if="error?.statusCode">{{ error?.statusCode }} - {{ errorMessage }}</p>
        <p v-else>{{ errorMessage }}</p>
        <!-- <button @click="goHome">Go Home</button> -->
        <!-- <NuxtLink to> -->
      </div>
    </div>
  </NuxtLayout>
</template>
