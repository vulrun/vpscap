<script setup>
const { title, description, icon } = useAppConfig();
// useSeoMeta({
//   title: `${title} - ${description}`,
//   description,
//   ogType: "website",
//   ogTitle: title,
//   ogDescription: description,
//   ogImage: image,
//   twitterTitle: title,
//   twitterDescription: description,
//   twitterImage: image,
//   twitterCard: "summary_large_image",
// });

useHead({
  htmlAttrs: { lang: "en" },
  link: [{ rel: "icon", type: "image/svg+xml", href: icon }],
});
</script>

<template>
  <NuxtLayout>
    <Sonner />
    <NuxtLoadingIndicator color="#000" />
    <NuxtPage />
  </NuxtLayout>
</template>
