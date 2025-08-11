<script setup>
const isSubmitting = ref(false);
const isLoading = ref(true);
const testStatus = ref({});
const useByUrl = ref("true");
const errors = ref([]);
const smtp = reactive({
  from: "",
  host: "",
  port: "",
  user: "",
  pass: "",
  ssl: false,
  url: "",
});

function getRefValues() {
  const result = {};
  for (const key in smtp) {
    result[key] = smtp[key];
  }
  return result;
}

function setRefValues(obj) {
  for (const key in obj) {
    if (key in smtp) {
      smtp[key] = obj[key];
    }
  }
}

function getColorClassByExitCode(code) {
  if (code === 0) return `text-green-700`;
  if (code === 1) return `text-red-700`;
  if (code === 2) return `text-pink-600`;
  if (code === 3) return `text-amber-700`;

  return `text-gray-800`;
}

function getMessageByExitCode(code) {
  if (code === 0) return `Success, this reaches to your inbox.`;
  if (code === 1) return `Failed, unable to deliver your test email, try again.`;
  if (code === 2) return `New changes detected, hit the above TEST EMAIL button.`;
  if (code === 3) return `Never Executed, hit the above TEST EMAIL button.`;

  return `please wait...`;
}

// make datebase entries
async function fetchSettings() {
  const data = await useApi(`/api/fetch/getAccountData?fields=smtpUrl,smtpFrom,smtpUseByUrl,smtpTestStatus`);
  return {
    url: data?.smtpUrl,
    from: data?.smtpFrom,
    useByUrl: String(data?.smtpUseByUrl),
    testStatus: data?.smtpTestStatus,
  };
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
    const body = { smtpUrl: smtp?.url, smtpFrom: smtp?.from, smtpUseByUrl: useByUrl.value == "true", smtpTestStatus: { exit: 2 } };
    const resp = await useApi(`/api/action/setAccountData`, { method: "POST", body });

    await loadComponent();
    isSubmitting.value = false;
    toast("Saved successfully.");
  } catch (error) {
    isSubmitting.value = false;
    errors.value = [error?.message || error || "oops, something went wrong"];
    toast(error?.message || error || "oops, something went wrong");
  }
}

async function sendTestEmail() {
  try {
    testStatus.value = { exit: -1 };

    // doing api call
    const body = { timestamp: Date.now() };
    const resp = await useApi(`/api/action/sendSmtpTestEmail`, { method: "POST", body });

    await loadComponent();
    // await delay(400);
  } catch (e) {
    console.warn(e);
  }
}

async function loadComponent() {
  const saved = await fetchSettings();
  isLoading.value = false;

  if (typeof saved?.testStatus?.exit === "number") {
    testStatus.value = saved?.testStatus;
  } else {
    testStatus.value = { exit: 3 };
  }

  if (saved?.useByUrl) {
    useByUrl.value = ["true", "false"].includes(saved?.useByUrl) ? saved?.useByUrl : "true";
  }

  if (saved?.from) {
    setRefValues({ from: saved?.from });
  }
  if (saved?.url) {
    setRefValues({ url: saved?.url });
    setRefValues(parseSmtpUrl(saved?.url));
  } else if (saved?.host) {
    setRefValues({
      host: saved?.host || "",
      port: saved?.port || "",
      user: saved?.user || "",
      pass: saved?.pass || "",
      ssl: saved?.ssl || false,
    });
  }
}

onBeforeMount(() => loadComponent());

watch(
  () => smtp.url,
  (newUrl, oldUrl) => {
    if (newUrl === "") {
      return setRefValues({ host: "", port: "", user: "", pass: "", ssl: false });
    }
    if (newUrl !== oldUrl) {
      const validator = validateSmtpUrl(newUrl);
      if (!validator.valid) {
        errors.value = [validator.message];
      } else {
        errors.value = [];
      }

      const parsed = parseSmtpUrl(newUrl);
      return setRefValues(parsed);
    }
  }
);

watch(
  () => [smtp.host.value, smtp.port.value, smtp.user.value, smtp.pass.value, smtp.ssl.value],
  () => {
    const smtpUrl = buildSmtpUrl(getRefValues());
    if (smtpUrl) setRefValues({ url: smtpUrl });
  }
);
</script>

<template>
  <div class="flex w-full">
    <Loading v-if="isLoading" class="mx-auto my-20" size="80" />
    <div v-else class="w-full space-y-6 text-stone-700 dark:text-white">
      <LabelBlock class="space-y-1">
        <LabelText>SMTP From</LabelText>
        <Input v-model="smtp.from" placeholder="example@domain.xyz" />
      </LabelBlock>

      <RadioGroup class="flex items-center gap-3" v-model="useByUrl">
        <LabelText>Use By:</LabelText>
        <LabelBlock class="flex items-center leading-none">
          <RadioGroupItem value="true" />
          <span class="pl-2">URL</span>
        </LabelBlock>
        <LabelBlock class="flex items-center leading-none">
          <RadioGroupItem value="false" />
          <span class="pl-2">Host</span>
        </LabelBlock>
      </RadioGroup>

      <LabelBlock class="space-y-1" :class="{ disabled: useByUrl === 'false' }">
        <LabelText>SMTP URL</LabelText>
        <Input v-model="smtp.url" placeholder="smtp://user:pass@mail.example.com:587" />
      </LabelBlock>

      <div class="grid grid-cols-2 gap-4" :class="{ disabled: useByUrl === 'true' }">
        <LabelBlock class="space-y-1">
          <LabelText>SMTP Host</LabelText>
          <Input autocomplete="off" v-model="smtp.host" placeholder="mail.example.com" />
        </LabelBlock>

        <LabelBlock class="space-y-1">
          <LabelText>SMTP Port</LabelText>
          <Input autocomplete="off" v-model="smtp.port" placeholder="465/25" type="number" />
        </LabelBlock>

        <LabelBlock class="space-y-1">
          <LabelText>SMTP User</LabelText>
          <Input autocomplete="off" v-model="smtp.user" placeholder="username" />
        </LabelBlock>

        <LabelBlock class="space-y-1">
          <LabelText>SMTP Password</LabelText>
          <Input autocomplete="off" v-model="smtp.pass" placeholder="password" type="password" />
        </LabelBlock>

        <LabelBlock class="flex items-center space-x-2">
          <ToogleSwitch v-model="smtp.ssl" />
          <LabelText>Use SSL</LabelText>
        </LabelBlock>
      </div>

      <div class="flex items-center space-x-2 mt-4" :class="{ disabled: isSubmitting }">
        <Button size="sm" class="ring-1 ring-gray-300 uppercase" variant="" @click.prevent="saveSettings">Save</Button>
        <Button size="sm" class="ring-1 ring-gray-300 uppercase" variant="secondary" @click.prevent="sendTestEmail">Test Email</Button>
      </div>

      <div v-if="typeof testStatus?.exit === 'number'" class="tracking-normal">
        Test Email Status:
        <span :class="cn('font-semibold', getColorClassByExitCode(testStatus?.exit))">{{ [getMessageByExitCode(testStatus?.exit), testStatus?.note].join(" ") }}</span>
      </div>
      <div v-if="isSubmitting" class="font-semibold text-sky-800">Please wait...</div>
      <div v-else class="font-medium text-red-600">{{ errors.join(" ") }}</div>
    </div>
  </div>
</template>
