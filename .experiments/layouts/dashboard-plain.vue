<script setup>
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  LogOut,
  Map,
  MoreHorizontal,
  PieChart,
  Plus,
  Settings2,
  Sparkles,
  SquareTerminal,
  Trash2,
} from "lucide-vue-next";

const { title, icon } = useAppConfig();

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://lh3.googleusercontent.com/a/AAcHTteViE6o2QuNGyRwp7KIUQUQdCRn4H0237U1dwH9=s256",
  },
};
</script>

<template>
  <!-- style="box-shadow: rgba(0, 0, 0, 0.2) 0.25rem 0px 0.5rem 0px" -->

  <!-- <Sidebar collapsible="icon" class="bg-gray-700 text-white border-none"> -->
  <!-- <SidebarHeader class="-p-2 bg-gray-50 overflow-hidden"> -->

  <div class="w-full min-h-screen grid grid-cols-[220px_1fr] md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
    <div class="--hidden --md:block border-r bg-gray-700">
      <div class="flex h-full max-h-screen flex-col pb-2">
        <NuxtLink to="/" class="flex items-center h-14 lg:h-[60px] px-4 gap-3 font-bold text-lg border-b border-cyan-600 bg-gray-50">
          <img :src="icon" class="size-6" />
          <span>{{ title }}</span>
        </NuxtLink>

        <div class="flex-1">
          <SidebarNav />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button size="lg" class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex justify-start">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage :src="data.user.avatar" :alt="data.user.name" />
                <AvatarFallback class="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ data.user.name }}</span>
                <span class="truncate text-xs">{{ data.user.email }}</span>
              </div>
              <ChevronsUpDown class="ml-auto size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-sm" side="bottom" align="end" :side-offset="4">
            <DropdownMenuLabel class="p-0 font-normal">
              <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar class="size-8 rounded-sm">
                  <AvatarImage :src="data?.user?.avatar" :alt="data?.user?.name" />
                  <AvatarFallback class="rounded-sm">CN</AvatarFallback>
                </Avatar>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-semibold">{{ data.user.name }}</span>
                  <span class="truncate text-xs">{{ data.user.email }}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <div class="flex-1 bg-gray-100">
      <main class="flex flex-col lg:max-w-[1200px] xl:max-w-[1400px] mx-auto p-4 lg:p-6 gap-4 lg:gap-6">
        <slot />
      </main>
    </div>
  </div>
</template>
