<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FilterBar from '@/components/gallery/FilterBar.vue'
import PaintingGrid from '@/components/gallery/PaintingGrid.vue'
import PaintingDetail from '@/components/gallery/PaintingDetail.vue'

const route = useRoute()
const router = useRouter()
const selectedId = ref<string | null>(null)

function syncFromRoute() {
  const id = route.params.id
  selectedId.value = typeof id === 'string' ? id : null
}

function onGalleryNav(e: Event) {
  const id = (e as CustomEvent).detail as string
  selectedId.value = id
  router.replace({ name: 'GalleryDetail', params: { id } })
}

onMounted(() => {
  syncFromRoute()
  window.addEventListener('gallery-nav', onGalleryNav)
})

onUnmounted(() => {
  window.removeEventListener('gallery-nav', onGalleryNav)
})

function openDetail(id: string) {
  selectedId.value = id
  router.push({ name: 'GalleryDetail', params: { id } })
}

function closeDetail() {
  selectedId.value = null
  router.push({ name: 'Gallery' })
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="font-display text-3xl font-bold text-text mb-6">🖼 作品展厅</h1>
    <FilterBar />
    <PaintingGrid @select="openDetail" />
    <PaintingDetail v-if="selectedId" :painting-id="selectedId" @close="closeDetail" />
  </div>
</template>
