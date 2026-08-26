<script setup lang="ts">
import { useGalleryStore } from '@/stores/galleryStore'

const store = useGalleryStore()
const categories = ['全部', '民俗', '农耕', '节庆', '新时代']
</script>

<template>
  <div class="flex flex-wrap items-center gap-4 mb-8 p-4 bg-card rounded-xl shadow-sm">
    <!-- 第一行：分类标签按钮组 + 重置筛选 -->
    <div class="flex flex-wrap items-center gap-4 w-full">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="[
          'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
          store.filterCategory === cat
            ? 'bg-red text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-text hover:bg-red-light hover:text-white',
        ]"
        @click="store.setCategory(cat)"
      >
        {{ cat }}
      </button>

      <button
        class="ml-auto text-sm text-text-muted hover:text-red"
        @click="store.resetFilters()"
      >
        重置筛选
      </button>
    </div>

    <!-- 第二行：作者搜索 + 关键词搜索 -->
    <div class="flex flex-wrap items-center gap-3 w-full">
      <label class="text-sm text-text-muted whitespace-nowrap">作者</label>
      <input
        type="text"
        placeholder="搜索作者"
        :value="store.filterAuthor"
        class="max-w-48 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-red-light"
        @input="store.setAuthor(($event.target as HTMLInputElement).value)"
      />

      <label class="text-sm text-text-muted whitespace-nowrap">关键词</label>
      <input
        type="text"
        placeholder="搜索作品名称、标签关键词"
        :value="store.filterKeyword"
        class="max-w-56 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-red-light"
        @input="store.setKeyword(($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>
</template>
