<script setup lang="ts">
// A-UI, B-逻辑：useSearch 由 B 实现，A 在此组件中调用
import { ref } from 'vue'
import { useSearch } from '@/composables/useSearch'

const { query, results, isSearching } = useSearch()
const isOpen = ref(false)

defineExpose({ isOpen })
</script>

<template>
  <div>
    <!-- Search trigger button -->
    <button
      class="p-2 rounded-lg text-text-muted hover:text-text transition-colors"
      aria-label="搜索"
      @click="isOpen = true"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>

    <!-- Modal overlay -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
      role="dialog"
      aria-label="搜索"
      @click.self="isOpen = false"
    >
      <div class="w-full max-w-xl mx-4 bg-card rounded-xl shadow-2xl overflow-hidden">
        <div class="flex items-center gap-3 px-4 py-3 border-b border-text-muted/20">
          <svg class="w-5 h-5 text-text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="query"
            type="text"
            class="flex-1 bg-transparent text-text placeholder-text-muted outline-none text-lg"
            placeholder="搜索画作、创作者、文化知识..."
            aria-label="搜索关键词"
            autofocus
          />
          <button
            class="p-1 text-text-muted hover:text-text"
            aria-label="关闭搜索"
            @click="isOpen = false"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Results -->
        <div class="max-h-80 overflow-y-auto p-2">
          <p v-if="isSearching" class="text-center text-text-muted py-8">搜索中...</p>
          <p v-else-if="!query" class="text-center text-text-muted py-8">输入关键词开始搜索</p>
          <p v-else-if="results.length === 0" class="text-center text-text-muted py-8">未找到相关结果</p>
          <router-link
            v-for="result in results"
            :key="result.route + result.title"
            :to="result.route"
            class="block p-3 rounded-lg hover:bg-bg transition-colors"
            @click="isOpen = false"
          >
            <div class="flex items-center gap-2">
              <span class="text-xs px-2 py-0.5 rounded bg-red text-white">{{ result.type }}</span>
              <span class="font-medium text-text">{{ result.title }}</span>
            </div>
            <p class="text-sm text-text-muted mt-1">{{ result.excerpt }}</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
