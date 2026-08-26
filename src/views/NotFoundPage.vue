<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <h1 class="font-display text-6xl text-red mb-4">404</h1>
    <p class="text-text-muted text-lg mb-8">页面未找到，您访问的页面可能不存在或已被移除。</p>
    <button
      class="px-6 py-2 bg-red text-white rounded-lg hover:bg-red-light transition-colors"
      aria-label="返回首页"
      @click="router.push('/')"
    >
      返回首页
    </button>
  </div>
</template>
