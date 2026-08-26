<script setup lang="ts">
// A: 3个图标入口
const entries = [
  { icon: '🎨', label: '画作浏览', desc: '欣赏东丰农民画精粹', to: '/gallery' },
  { icon: '🖌️', label: '涂色游戏', desc: '亲手体验农民画色彩', to: '/interact' },
  { icon: '📝', label: '知识答题', desc: '测试非遗知识储备', to: '/interact' },
]
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" aria-label="快速入口">
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <router-link
        v-for="entry in entries"
        :key="entry.label"
        :to="entry.to"
        class="flex flex-col items-center gap-2 p-6 bg-card rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
        :aria-label="entry.label"
      >
        <span class="text-3xl" aria-hidden="true">{{ entry.icon }}</span>
        <span class="font-display font-semibold text-text">{{ entry.label }}</span>
        <span class="text-xs text-text-muted">{{ entry.desc }}</span>
      </router-link>
    </div>
  </section>
</template>
