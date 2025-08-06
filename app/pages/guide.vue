<script setup>
definePageMeta({ layout: "dashboard" });

const { data, status, error, refresh, clear } = useAsyncData("prerequisite", () => useApi(`/api/verify`));
const stepLabels = {
  //
  install_nginx: "Install Nginx",
  setup_nginx: "Setup Nginx Configuration",
  install_pm2: "Install PM2",
  install_php: "Install PHP and modules",
};

const activeStep = useLocalRef("guide-active-index", 0);
function changeStep(idx) {
  const maxIdx = Object.keys(stepLabels).length - 1;
  activeStep.value = Math.max(0, Math.min(idx, maxIdx));
}
</script>

<template>
  <div class="w-full max-w-screen-ld mx-auto space-y-4">
    <div class="hstack relative">
      <MainHeading title="Welcome folks!">Here&apos;s the steps, to make your server ready for the deployments!</MainHeading>
      <Button variant="outline" class="absolute right-0 top-0 border-gray-300 shadow-xs hover:bg-transparent hover:border-gray-400" @click.prevent="refresh">Verify</Button>
    </div>

    <div class="w-full grid md:grid-cols-[320px_1fr] lg:grid-cols-[400px_1fr]">
      <GuideSidebar :active_step="activeStep" :steps="stepLabels" :statuses="data?.prerequisite" :onUpdate="changeStep" />

      <GuideContent :active_step="activeStep" :steps="stepLabels" step_key="install_nginx">
        <p>
          Since this is our first interaction with the apt packaging system in this session, we will update our local package index so that we have access to the most recent package listings.
          Afterwards, we can install <code>nginx</code>
        </p>
        <CopyText textToCopy="sudo apt update"></CopyText>

        <p>Now, lets install nginx</p>
        <CopyText textToCopy="sudo apt install nginx" />

        <p>Checking web server status</p>
        <CopyText textToCopy="sudo systemctl status nginx" />
      </GuideContent>

      <GuideContent :active_step="activeStep" :steps="stepLabels" step_key="setup_nginx">
        <!-- <p>Lets make changes to the nginx configuration, choose your cli editor from nano/vim or anything you like</p> -->
        <p>Lets make changes to the nginx configuration, execute the below command, to update nginx configurations</p>
        <CopyText textToCopy="npm run tweak-nginx-conf" />
      </GuideContent>

      <GuideContent :active_step="activeStep" :steps="stepLabels" step_key="install_pm2"></GuideContent>

      <GuideContent :active_step="activeStep" :steps="stepLabels" step_key="install_php">
        <p>
          Since this is our first interaction with the apt packaging system in this session, we will update our local package index so that we have access to the most recent package listings.
          Afterwards, we can install <code>nginx</code>
        </p>
        <CopyText textToCopy="sudo apt update"></CopyText>

        <p>Now, lets install php latest version</p>
        <CopyText textToCopy="sudo apt install php" />

        <!-- <p>Checking web server status</p> -->
        <!-- <CopyText textToCopy="sudo systemctl status nginx" /> -->
      </GuideContent>
    </div>
  </div>
</template>
