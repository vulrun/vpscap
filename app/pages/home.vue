<script setup>
definePageMeta({ layout: "dashboard" });
import { ShieldCheckIcon, RssIcon, Layers2Icon } from "lucide-vue-next";

const pm2Stats = useApiFetch(`/api/fetch/pm2Stats`);
const sslStats = useApiFetch(`/api/fetch/sslStats`);
const webStats = useApiFetch(`/api/fetch/webStats`);
const serverInfo = useApiFetch(`/api/fetch/serverInfo`);
const systemInfo = useApiFetch(`/api/fetch/systemInfo`);
const physicalMem = useApiFetch(`/api/fetch/physicalMem`);
const diskFileSys = useApiFetch(`/api/fetch/diskFileSys`);
</script>

<template>
  <div class="flex flex-col flex-1 gap-4">
    <MainHeading title="Welcome folks!">Your cute server information embeded here!</MainHeading>

    <div class="grid auto-rows-min gap-4 lg:grid-cols-3">
      <HomeStatCard title="SSL Certificates" :icon="ShieldCheckIcon" :fetch="sslStats" />
      <HomeStatCard title="Web Sites" :icon="RssIcon" :fetch="webStats" />
      <HomeStatCard title="PM2 Services" :icon="Layers2Icon" :fetch="pm2Stats" />
    </div>

    <div class="grid auto-rows-min gap-4 md:grid-cols-2">
      <HomeInfoCard title="Server Overview" :fetch="serverInfo" />
      <HomeInfoCard title="System Overview" :fetch="systemInfo" />
    </div>

    <HomeDescCard title="Physical Memory" :fetch="physicalMem" />
    <HomeDescCard title="Disk File System" :fetch="diskFileSys" />
  </div>
</template>
