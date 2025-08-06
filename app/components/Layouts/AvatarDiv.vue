<script setup>
const profile = ref({
  name: "",
  email: "",
  avatar: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxzdmcgdmlld0JveD0iMCAwIDE2IDE2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KICA8cGF0aCBmaWxsPSIjODg4IiBkPSJtIDggMSBjIC0xLjY1NjI1IDAgLTMgMS4zNDM3NSAtMyAzIHMgMS4zNDM3NSAzIDMgMyBzIDMgLTEuMzQzNzUgMyAtMyBzIC0xLjM0Mzc1IC0zIC0zIC0zIHogbSAtMS41IDcgYyAtMi40OTIxODggMCAtNC41IDIuMDA3ODEyIC00LjUgNC41IHYgMC41IGMgMCAxLjEwOTM3NSAwLjg5MDYyNSAyIDIgMiBoIDggYyAxLjEwOTM3NSAwIDIgLTAuODkwNjI1IDIgLTIgdiAtMC41IGMgMCAtMi40OTIxODggLTIuMDA3ODEyIC00LjUgLTQuNSAtNC41IHogbSAwIDAiIC8+DQo8L3N2Zz4NCg==`,
});

const isLoading = computed(() => !profile?.value?.name);

onMounted(async () => {
  const data = await useApi(`/api/verify`);
  profile.value = data?.profile;
});
</script>

<template>
  <div :class="cn('hstack gap-2 transition-opacity')">
    <template v-if="isLoading">
      <Skeleton class="size-8 rounded-lg overflow-hidden" />
      <div class="flex-1 grid text-left">
        <Skeleton class="h-3 w-14 my-0.5" />
        <Skeleton class="h-3 w-40 my-0.5" />
      </div>
    </template>
    <template v-else>
      <Avatar class="size-8 rounded-lg overflow-hidden">
        <AvatarImage :src="profile?.avatar" :alt="profile?.name" />
        <AvatarFallback>{{ createAvatarInitials(profile?.name) }}</AvatarFallback>
      </Avatar>
      <div class="flex-1 grid text-left">
        <span class="truncate tracking-wide text-sm font-medium">{{ profile?.name }}</span>
        <span class="truncate tracking-wide text-xs opacity-70">{{ profile?.email }}</span>
      </div>
    </template>
  </div>
</template>
