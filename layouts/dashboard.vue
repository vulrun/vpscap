<script setup>
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-vue-next";
</script>

<template>
  <div class="grid min-h-screen w-full lg:grid-cols-[280px_1fr] relative">
    <div class="hidden lg:block bg-gray-800">
      <LayoutsSidebar fixed_classes="w-[280px]" class="w-[280px] h-full" :styles="{ boxShadow: 'rgba(0, 0, 0, 0.4) 0.25rem -0.5rem 1rem 0.1rem' }" />
    </div>

    <Sheet>
      <SheetTrigger as-child>
        <Button variant="outline" size="icon" class="shrink-0 lg:hidden fixed top-4 left-6 m-0">
          <Menu class="size-5" />
          <span class="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" class="w-[300px] flex flex-col bg-gray-800 p-0 gap-0 border-r-0">
        <LayoutsSidebar fixed_classes="w-[300px]" class="w-[300px]" />
      </SheetContent>
    </Sheet>

    <section class="bg-gray-100 pt-10 lg:pt-0">
      <main class="w-full max-w-full lg:max-w-[900px] xl:max-w-[1000px] 2xl:max-w-[1200px] mx-auto p-6 gap-6">
        <slot />
      </main>
    </section>
  </div>
</template>
