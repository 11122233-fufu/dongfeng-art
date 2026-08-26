<script setup lang="ts">
import { computed } from 'vue'
import type { Painting } from '@/stores/galleryStore'
import { useFavoriteStore } from '@/stores/favoriteStore'

const props = defineProps<{ painting: Painting }>()
const emit = defineEmits<{ click: [id: string] }>()

const fav = useFavoriteStore()

const displayTags = computed(() => {
  const tags = props.painting.tags
  if (tags.length <= 3) return tags
  return [...tags.slice(0, 3), `+${tags.length - 3}`]
})
</script>

<template>
  <div
    class="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    @click="emit('click', painting.id)"
  >
    <div class="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
      <img
        :src="painting.images.thumbnail"
        :alt="painting.title"
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <button
        class="absolute top-2 right-2 w-9 h-9 bg-white/80 dark:bg-black/40 backdrop-blur-sm hover:bg-white dark:hover:bg-black/60 rounded-full flex items-center justify-center transition-colors"
        :aria-label="fav.isFav(painting.id) ? '取消收藏' : '收藏'"
        @click.stop="fav.toggle(painting.id)"
      >
        <span v-if="fav.isFav(painting.id)" class="text-red text-lg">♥</span>
        <span v-else class="text-gray-400 text-lg hover:text-red transition-colors">♡</span>
      </button>
    </div>

    <div class="p-3">
      <h3 class="font-display font-bold text-text text-base truncate">
        {{ painting.title }}
      </h3>
      <p class="text-sm text-text-muted mt-0.5">
        {{ painting.author }} · {{ painting.year }}
      </p>
      <div class="flex flex-wrap gap-1 mt-2">
        <span
          v-for="tag in displayTags"
          :key="tag"
          class="px-2 py-0.5 text-xs rounded-full bg-red-light/20 text-red"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>
