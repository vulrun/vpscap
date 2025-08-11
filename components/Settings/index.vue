<script setup>
// import SettingsGeneral from "@@/components/Settings/General";
import SettingsCronJobs from "@@/components/Settings/CronJobs";
import SettingsSmtpSettings from "@@/components/Settings/SmtpSettings";
// import SettingsNotifications from "@@/components/Settings/Notifications";

const navItems = [
  // {
  //   slug: "general",
  //   navLabel: "General",
  //   label: "General Settings",
  //   brief: "Be updated always with your settings",
  //   component: SettingsGeneral,
  // },
  // {
  //   slug: "notifications",
  //   navLabel: "Notifications",
  //   label: "Email Notifications",
  //   brief: "Choose which email notifications you want to receive",
  //   component: SettingsNotifications,
  // },
  {
    slug: "cronjobs",
    navLabel: "Cron Jobs",
    label: "Cron Jobs Settings",
    brief: "Choose how cron-jobs works on your vps",
    component: SettingsCronJobs,
  },
  {
    slug: "smtpSettings",
    navLabel: "SMTP Settings",
    label: "SMTP Settings",
    brief: "Configure your vps to send emails globally",
    component: SettingsSmtpSettings,
  },
];

const currentSlug = ref(navItems?.[0]?.slug);
const selectedOne = computed(() => navItems.find((itm) => itm?.slug === currentSlug.value));
const gotoSection = (slug) => (currentSlug.value = slug);
</script>
<template>
  <div class="flex-1 mx-auto grid w-full items-start md:grid-cols-[180px_1fr] lg:grid-cols-[200px_1fr] xl:grid-cols-[240px_1fr] overflow-y-auto">
    <aside class="bg-gray-200/50 p-4 pl-3 h-full" :style="{ __boxShadow_kill: 'rgba(0, 0, 0, 0.3) 2px 0 16px 1px' }">
      <nav class="grid gap-1">
        <button
          v-for="item in navItems"
          :key="item?.slug"
          class="px-2 py-1 text-left text-sm text-gray-800 rounded-md border border-transparent outline-none"
          :class="
            cn(
              currentSlug === item?.slug //
                ? 'font-semibold bg-gray-300'
                : 'hover:bg-gray-200'
            )
          "
          @click.prevent="gotoSection(item?.slug)"
        >
          {{ item?.navLabel || item?.label }}
        </button>
      </nav>
    </aside>

    <main class="flex-1 p-8">
      <div class="space-y-6">
        <div v-if="selectedOne?.label || selectedOne?.brief">
          <h3 :class="cn('text-md font-medium', selectedOne?.labelClass)">{{ selectedOne?.label || "" }}</h3>
          <p :class="cn('text-xs text-muted-foreground', selectedOne?.briefClass)">{{ selectedOne?.brief || "" }}</p>
        </div>

        <component v-if="selectedOne?.component" :is="selectedOne?.component" class="text-sm" />
        <pre v-else-if="currentSlug">component is missing</pre>
      </div>
    </main>
  </div>
</template>
