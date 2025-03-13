<script setup>
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://lh3.googleusercontent.com/a/AAcHTteViE6o2QuNGyRwp7KIUQUQdCRn4H0237U1dwH9=s256",
  },
};
</script>

<template>
  <div class="hstack gap-2">
    <Avatar class="size-8 rounded-md [&_*]:rounded-md">
      <AvatarImage :src="data.user.avatar" :alt="data.user.name" />
      <AvatarFallback>{{ createAvatarInitials(data?.user?.name) }}</AvatarFallback>
    </Avatar>
    <div class="grid flex-1 text-left">
      <span class="truncate tracking-wide text-sm font-medium">{{ data.user.name }}</span>
      <span class="truncate tracking-wide text-xs opacity-75">{{ data.user.email }}</span>
    </div>
  </div>
</template>
