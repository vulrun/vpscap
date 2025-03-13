<script setup>
import {
  SwatchBookIcon,
  CpuIcon,
  ShieldCheckIcon,
  RssIcon,
  TerminalIcon,
  AirplayIcon,
  ChevronsUpDownIcon,
  MonitorCheckIcon,
  BadgeCheckIcon,
  ComputerIcon,
  SettingsIcon,
  BellIcon,
  LogOutIcon,
} from "lucide-vue-next";

const props = defineProps(["class", "styles", "fixed_classes"]);
const { title, icon } = useAppConfig();
const config = useRuntimeConfig();
const route = useRoute();
const navs = [
  //
  {
    icon: CpuIcon,
    label: "Dashboard",
    href: "/home",
  },
  {
    icon: ShieldCheckIcon,
    label: "SSL Certificates",
    href: "/certs",
  },
  {
    icon: RssIcon,
    label: "Web Sites",
    href: "/sites",
  },
  {
    icon: ComputerIcon,
    label: "--PM2",
    href: "/sample",
  },
  {
    icon: TerminalIcon,
    label: "--Deploys",
    href: "/sample",
  },
  {
    icon: AirplayIcon,
    label: "--Actions",
    href: "/sample",
  },
  {
    icon: SwatchBookIcon,
    label: "--sample",
    href: "/sample",
  },
].filter((i) => {
  return i?.label?.startsWith("--") ? String(config?.public?.appEnv).startsWith("dev") : true;
});

function doLogout() {
  localStorage.removeItem("WebAppToken");
  return navigateTo("/");
}
</script>

<template>
  <div :class="cn('flex h-full flex-col relative overflow-hidden', props?.class)" :style="{ ...props?.styles }">
    <NuxtLink to="/" class="flex items-center h-[60px] px-4 gap-3 font-bold text-lg border-b-8 border-cyan-600 bg-gray-50 shrink-0">
      <img :src="icon" class="size-6" />
      <span>{{ title }}</span>
    </NuxtLink>

    <div class="flex-1">
      <nav class="grid items-start text-sm text-white">
        <NuxtLink
          v-for="nav of navs"
          :to="nav.href"
          :class="['flex items-center gap-4 px-4 py-3 tracking-wide text-white hover:bg-slate-700 transition-all border-0', { 'bg-cyan-900': route.path === nav.href }]"
        >
          <component :is="nav.icon" class="size-4" />
          {{ nav?.label }}
        </NuxtLink>
      </nav>
    </div>

    <div :class="cn('w-full fixed bottom-0 left-0 right-0 p-2', props?.fixed_classes)">
      <DropdownMenu>
        <DropdownMenuTrigger class="w-full hstack p-2 gap-2 rounded-md shadow transition-all text-gray-200 bg-gray-50/10 hover:bg-gray-50/20 data-[state=open]:bg-gray-50/20">
          <LayoutsAvatarDiv />
          <ChevronsUpDownIcon class="ml-auto size-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-sm" side="bottom" align="end" :side-offset="4">
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center px-1 py-1.5 text-left text-sm">
              <LayoutsAvatarDiv />
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem as-child class="cursor-pointer">
            <NuxtLink to="/guide">
              <MonitorCheckIcon />
              Installation Guide
            </NuxtLink>
          </DropdownMenuItem>
          <!-- <DropdownMenuItem as-child class="cursor-pointer">
              <NuxtLink to="/guide">
                <BadgeCheckIcon />
                Account
              </NuxtLink>
            </DropdownMenuItem> -->
          <!-- <DropdownMenuItem as-child class="cursor-pointer">
              <NuxtLink to="/guide">
                <BellIcon />
                Notifications
              </NuxtLink>
            </DropdownMenuItem> -->
          <DropdownMenuItem as-child class="cursor-pointer">
            <NuxtLink to="/settings">
              <SettingsIcon />
              Settings
            </NuxtLink>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem class="cursor-pointer" @click.prevent="doLogout">
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>
