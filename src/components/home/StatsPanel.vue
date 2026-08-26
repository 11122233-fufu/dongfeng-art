<script setup lang="ts">
// A: 4个统计数字
import { useGalleryStore } from '@/stores/galleryStore'
import artistsData from '@/data/artists.json'

const gallery = useGalleryStore()
const stats = [
  { label: '收录画作', value: gallery.allPaintings.length },
  { label: '创作者', value: artistsData.length },
  { label: '文化传承年', value: 40 },
  { label: '社会实践日志', value: 4 },
]
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" aria-label="数据看板">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-card rounded-xl p-6 text-center shadow-sm"
      >
        <p class="font-display text-3xl text-red font-bold">{{ stat.value }}</p>
        <p class="text-sm text-text-muted mt-1">{{ stat.label }}</p>
      </div>
    </div>
  </section>
</template>
