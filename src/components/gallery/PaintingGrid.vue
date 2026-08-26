<script setup lang="ts">
import { useGalleryStore } from '@/stores/galleryStore'
import PaintingCard from './PaintingCard.vue'

const emit = defineEmits<{ select: [id: string] }>()
const store = useGalleryStore()
</script>

<template>
  <div v-if="store.filteredPaintings.length === 0" class="text-center py-20 text-text-muted">
    <p class="text-lg">暂无符合条件的作品</p>
    <p class="text-sm mt-1">试试调整筛选条件</p>
  </div>

  <div
    v-else
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
  >
    <PaintingCard
      v-for="p in store.filteredPaintings"
      :key="p.id"
      :painting="p"
      @click="(id: string) => emit('select', id)"
    />
  </div>
</template>
