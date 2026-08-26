<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface PhotoItem {
  id: string
  src: string
  thumbnail: string
  caption: string
  date: string
}

const props = defineProps<{ photos: PhotoItem[] }>()

const currentIndex = ref(0)
const visible = ref(false)

function open(index: number) {
  currentIndex.value = index
  visible.value = true
}

function close() {
  visible.value = false
}

function prev() {
  if (props.photos.length === 0) return
  currentIndex.value = (currentIndex.value - 1 + props.photos.length) % props.photos.length
}

function next() {
  if (props.photos.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % props.photos.length
}

function onKeydown(e: KeyboardEvent) {
  if (!visible.value) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <!-- 图集网格 -->
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
    <div
      v-for="(photo, idx) in photos"
      :key="photo.id"
      class="aspect-square rounded-xl overflow-hidden cursor-pointer group relative bg-gray-100 dark:bg-gray-700"
      @click="open(idx)"
    >
      <img
        :src="photo.thumbnail"
        :alt="photo.caption"
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
      <p class="absolute bottom-1 left-2 right-2 text-white text-xs truncate">
        {{ photo.caption }}
      </p>
    </div>
  </div>

  <!-- 灯箱 -->
  <Teleport to="body">
    <div
      v-if="visible && photos[currentIndex]"
      class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      @click.self="close"
    >
      <!-- 关闭 -->
      <button
        class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white text-xl transition-colors"
        @click="close"
        aria-label="关闭"
      >
        ✕
      </button>

      <!-- 上一张 -->
      <button
        v-if="photos.length > 1"
        class="absolute left-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white text-2xl transition-colors"
        @click="prev"
        aria-label="上一张"
      >
        ‹
      </button>

      <!-- 图片 -->
      <div class="flex flex-col items-center max-h-[90vh]">
        <img
          :src="photos[currentIndex].src"
          :alt="photos[currentIndex].caption"
          class="max-h-[80vh] max-w-[90vw] object-contain rounded-lg"
        />
        <p class="text-white text-sm mt-3">
          {{ photos[currentIndex].caption }}
        </p>
        <p class="text-white/60 text-xs mt-1">
          {{ photos[currentIndex].date }}
        </p>
        <p class="text-white/40 text-xs mt-1">
          {{ currentIndex + 1 }} / {{ photos.length }}
        </p>
      </div>

      <!-- 下一张 -->
      <button
        v-if="photos.length > 1"
        class="absolute right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white text-2xl transition-colors"
        @click="next"
        aria-label="下一张"
      >
        ›
      </button>
    </div>
  </Teleport>
</template>
