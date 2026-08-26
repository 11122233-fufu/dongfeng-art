<script setup lang="ts">
// A: 横向自动滚动公告条
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2" aria-label="公告">
    <div class="bg-card rounded-lg px-4 py-3 overflow-hidden border border-text-muted/10">
      <div class="flex items-center gap-2 text-sm">
        <span class="text-red font-semibold shrink-0">📢 公告</span>
        <div class="overflow-hidden flex-1">
          <p class="animate-marquee whitespace-nowrap text-text-muted">
            欢迎来到东丰农民画线上展馆 · 2026暑期社会实践成果展示中 · 更多精彩内容持续更新
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
.animate-marquee {
  animation: marquee 20s linear infinite;
}
</style>
