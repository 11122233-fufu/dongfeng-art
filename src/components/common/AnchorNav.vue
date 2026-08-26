<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

/* ==================== 区块：严格按页面从上到下顺序 ==================== */
interface NavItem {
  id: string
  label: string
}

const navItems: NavItem[] = [
  { id: 'hero',     label: '01 封面' },
  { id: 'intro',    label: '02 简介' },
  { id: 'entry',    label: '03 入口' },
  { id: 'featured', label: '04 精选' },
  { id: 'stats',    label: '05 数据' },
  { id: 'news',     label: '06 动态' },
]

/* ==================== 状态 ==================== */
const activeId = ref('hero')

/* ==================== 点击圆点 → 平滑滚动 ==================== */
function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* ==================== 滚动监听 → 自动高亮 ==================== */
let ticking = false

function updateActive() {
  // 从页面顶部偏移 120px 作为判定线（避免 hero 底部就切走）
  const scrollTop = window.scrollY + 120

  // 从下往上遍历，找到当前滚动位置所属的最后一个区块
  for (let i = navItems.length - 1; i >= 0; i--) {
    const el = document.getElementById(navItems[i].id)
    if (el && el.offsetTop <= scrollTop) {
      activeId.value = navItems[i].id
      return
    }
  }
  // 兜底：如果在所有区块上方（极少情况），亮第一个
  activeId.value = navItems[0].id
}

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateActive()
      ticking = false
    })
    ticking = true
  }
}

/* ==================== 生命周期 ==================== */
onMounted(() => {
  updateActive()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <nav
    class="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-5"
    aria-label="页面导航"
  >
    <a
      v-for="item in navItems"
      :key="item.id"
      :href="`#${item.id}`"
      class="group flex items-center gap-2.5 no-underline"
      @click.prevent="scrollTo(item.id)"
    >
      <!-- 文字标签 -->
      <span
        class="text-xs whitespace-nowrap bg-white/90 dark:bg-gray-800/90 text-text px-2 py-0.5 rounded shadow-sm transition-all duration-200"
        :class="activeId === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
      >
        {{ item.label }}
      </span>
      <!-- 圆点 -->
      <span
        class="rounded-full transition-all duration-300 shrink-0"
        :class="
          activeId === item.id
            ? 'w-3 h-3 bg-red scale-125 shadow-md shadow-red/30'
            : 'w-2.5 h-2.5 bg-gray-300 dark:bg-gray-500 group-hover:bg-gray-400'
        "
      />
    </a>
  </nav>
</template>
