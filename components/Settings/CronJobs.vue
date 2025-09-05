<script setup>
const isSubmitting = ref(true);
const isLoading = ref(true);
const responses = ref([]);
const errors = ref([]);
const cronJobSettings = reactive({
  installed_certs_daily_alerts: false,
  installed_certs_daily_renew: false,
  monitored_certs_daily_alerts: false,
  monitored_certs_daily_refresh: false,
  monitored_certs_hourly_retry: false,
});

const cronJobList = [
  {
    category: "Installed Certificates",
    jobs: [
      {
        slug: "installed_certs_daily_alerts",
        label: "Send Email Alerts",
        freq: "Daily",
        desc: "Receive email alerts for certificate activity and status changes.",
      },
      {
        slug: "installed_certs_daily_renew",
        label: "Renew Expired Certificates",
        freq: "Daily",
        desc: "Trigger automatic renewal of expired domain certificates.",
      },
    ],
  },
  {
    category: "Monitored Certificates",
    jobs: [
      {
        slug: "monitored_certs_daily_alerts",
        label: "Send Email Alerts",
        freq: "Daily",
        desc: "Receive email alerts for certificate activity and status changes.",
      },
      {
        slug: "monitored_certs_daily_refresh",
        label: "Hard Refresh Certificates",
        freq: "Daily",
        desc: "Clear cached monitor certificate data to ensure accuracy.",
      },
      {
        slug: "monitored_certs_hourly_retry",
        label: "Retry Errored Certificates",
        freq: "Hourly",
        desc: "Retry and refresh certificates that previously encountered errors.",
      },
    ],
  },
];

function getRefValues() {
  const result = {};
  for (const key in cronJobSettings) {
    result[key] = cronJobSettings[key];
  }
  return result;
}

function setRefValues(obj) {
  for (const key in obj) {
    if (key in cronJobSettings) {
      cronJobSettings[key] = obj[key];
    }
  }
}

onBeforeMount(() => loadComponent());

watch(
  () => [
    //
    cronJobSettings.installed_certs_daily_alerts.value,
    cronJobSettings.installed_certs_daily_renew.value,
    cronJobSettings.monitored_certs_daily_alerts.value,
    cronJobSettings.monitored_certs_daily_refresh.value,
    cronJobSettings.monitored_certs_hourly_retry.value,
  ],
  () => {
    // console.log("🚀 ~ cronJobSettings:", cronJobSettings);
  }
);

async function fetchSettings() {
  return await useApi(`/api/fetch/getAccountData?fields=cronJobSettings`);
}

async function saveSettings() {
  try {
    if (Array.from(errors.value).length) {
      return errors.value.push("Unable to submit, errors ahead.");
    }

    // reset values
    errors.value = [];
    isSubmitting.value = true;

    // doing api call
    const body = { cronJobSettings };
    const resp = await useApi(`/api/action/setAccountData`, { method: "POST", body });

    // await loadComponent();
    isSubmitting.value = false;
    toast("Saved successfully.");
  } catch (error) {
    isSubmitting.value = false;
    errors.value = [error?.message || error || "oops, something went wrong"];
    toast(error?.message || error || "oops, something went wrong");
  }
}

async function loadComponent() {
  const saved = await fetchSettings();

  setRefValues(saved?.cronJobSettings);
  isSubmitting.value = false;
  isLoading.value = false;
}

async function triggerCronJob(slug) {
  try {
    if (!slug) {
      return errors.value.push("Cronjob slug is missing.");
    }

    // reset values
    errors.value = [];
    isSubmitting.value = true;

    // doing api call
    const body = { jobSlug: slug };
    const resp = await useApi(`/api/action/triggerCronJob`, { method: "POST", body });

    const cronjob = cronJobList.flatMap((itm) => itm?.jobs?.map((job) => ({ ...job, category: itm.category })) || []).find((itm) => itm?.slug === slug);

    isSubmitting.value = false;
    responses.value = [`${cronjob?.category} ${cronjob?.label}: &nbsp; **\`${resp}\`**`];
    toast("Saved successfully.");
  } catch (error) {
    isSubmitting.value = false;
    errors.value = [error?.message || error || "oops, something went wrong"];
    toast(error?.message || error || "oops, something went wrong");
  }
}
</script>

<template>
  <div class="space-y-4">
    <Loading v-if="isLoading" class="mx-auto my-20" size="80" />
    <div v-else v-for="cat in cronJobList" :key="cat?.category" class="rounded-lg shadow border border-gray-200 p-3 space-y-5">
      <h3 class="text-base font-medium pb-2 border-b">{{ cat?.category }}</h3>

      <div v-for="jobs in cat?.jobs" :key="jobs?.slug" class="flex-1 flex items-center">
        <div class="space-y-0.5 mr-auto">
          <h5 class="text-sm">
            {{ jobs?.label }}
            <span class="uppercase text-xs tracking-normal font-semibold font-mono">
              <span class="text-gray-400 mx-2">&bull;</span>
              <span>{{ jobs?.freq }}</span>
            </span>
          </h5>
          <p class="text-xs m-0 text-muted-foreground">{{ jobs?.desc }}</p>
        </div>
        <Button variant="ghost" class="mr-3 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-600 text-xs h-[24px]" size="xs" @click.prevent="triggerCronJob(jobs?.slug)">TRY NOW</Button>
        <ToogleSwitch v-model="cronJobSettings[jobs?.slug]" @change="saveSettings" />
      </div>
    </div>

    <div v-if="isSubmitting" class="font-semibold text-sky-800">Please wait...</div>
    <div v-else-if="responses.length" class="font-normal text-green-800" v-html="markdownToHtmlLite(responses.join(' '))" />
    <div v-else class="font-medium text-red-600" v-html="markdownToHtmlLite(errors.join(' '))" />
  </div>
</template>
