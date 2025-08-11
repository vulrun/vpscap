<script setup>
const notifications = reactive({
  communication_emails: false,
  marketing_emails: false,
  social_emails: false,
  security_emails: false,
});

const alertTypes = [
  {
    slug: "communication_emails",
    label: "Communication emails",
    brief: "Receive emails about your account activity.",
  },
  {
    slug: "marketing_emails",
    label: "Marketing emails",
    brief: "Receive emails about new products, features, and more.",
  },
  {
    slug: "social_emails",
    label: "Social emails",
    brief: "Receive emails for friend requests, follows, and more.",
  },
  {
    slug: "security_emails",
    label: "Security emails",
    brief: "Receive emails about your account activity and security.",
  },
];
</script>

<template>
  <div class="space-y-4">
    <div v-for="alert in alertTypes" :key="alert?.slug" class="flex flex-row items-center justify-between rounded-lg border p-3">
      <div class="space-y-0.5">
        <h5 class="text-sm">{{ alert?.label }}</h5>
        <p class="text-xs m-0 text-muted-foreground">{{ alert?.brief }}</p>
      </div>
      <ToogleSwitch v-model="notifications[alert?.slug]" />
    </div>
  </div>
</template>
