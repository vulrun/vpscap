<script setup lang="ts">
// import { PlusCircledIcon, AlbumArtwork } from "lucide-vue-next";
import Sidebar from "@/components/Sidebar.vue";
// import PodcastEmptyPlaceholder from "@/components/PodcastEmptyPlaceholder.vue";
// import { listenNowAlbums, madeForYouAlbums } from "@/data/albums";
import { playlists } from "@/data/playlists";
</script>

<template>
  <div class="block">
    <TopMenu />
    <div class="border-t">
      <div class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar :playlists="playlists" />
        <div class="col-span-3 lg:col-span-4 lg:border-l">
          <div class="h-full px-4 py-6 lg:px-8">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
