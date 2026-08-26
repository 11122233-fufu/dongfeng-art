<script setup lang="ts">
// A: 从 @/data/paintings.json import 前 6 条，每张用 Tailwind 手写简易卡片
import { useGalleryStore } from '@/stores/galleryStore'
import { useFavoriteStore } from '@/stores/favoriteStore'

const gallery = useGalleryStore()
const fav = useFavoriteStore()
const allPaintings = gallery.allPaintings
const featured = allPaintings ? allPaintings.slice(0, 6) : []
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" aria-label="精选画作">
    <h2 class="font-display text-2xl text-text mb-6">精选画作</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="painting in featured"
        :key="painting.id"
        class="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
      >
        <router-link :to="`/gallery/${painting.id}`" :aria-label="`查看画作：${painting.title}`">
          <img
            :src="painting.images.thumbnail"
            :alt="painting.title"
            class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </router-link>
        <div class="p-4">
          <div class="flex items-start justify-between gap-2">
            <router-link
              :to="`/gallery/${painting.id}`"
              class="font-display font-semibold text-text hover:text-red transition-colors"
            >
              {{ painting.title }}
            </router-link>
            <button
              class="shrink-0 text-lg hover:scale-110 transition-transform"
              :aria-label="fav.isFav(painting.id) ? '取消收藏' : '添加收藏'"
              @click="fav.toggle(painting.id)"
            >
              {{ fav.isFav(painting.id) ? '❤️' : '🤍' }}
            </button>
          </div>
          <p class="text-sm text-text-muted mt-1">
            {{ painting.author }} · {{ painting.year }}
          </p>
          <span class="inline-block mt-2 text-xs px-2 py-0.5 rounded bg-yellow/10 text-yellow">
            {{ painting.category }}
          </span>
        </div>
      </article>
    </div>
  </section>
</template>
