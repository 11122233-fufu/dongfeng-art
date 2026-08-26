<script setup lang="ts">
import { ref } from 'vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import SearchModal from '@/components/common/SearchModal.vue'

const isMobileMenuOpen = ref(false)

const navItems = [
  { to: '/', label: '首页' },
  { to: '/gallery', label: '作品展厅' },
  { to: '/culture', label: '文化科普' },
  { to: '/artists', label: '创作者故事' },
  { to: '/media', label: '多媒体专区' },
  { to: '/interact', label: '互动体验' },
  { to: '/practice', label: '研学实践' },
]

function closeMenu(): void {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <nav
    class="sticky top-0 z-50 backdrop-blur bg-bg/80 border-b border-text-muted/20"
    role="navigation"
    aria-label="主导航"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link
          to="/"
          class="font-display text-xl font-bold text-red hover:text-red-light transition-colors"
          aria-label="机源四方·农墨传芳首页"
        >
          机源四方·农墨传芳
        </router-link>

        <!-- Desktop Nav -->
        <div class="hidden lg:flex items-center gap-1">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="px-3 py-2 text-sm text-text-muted hover:text-text rounded-lg transition-colors"
            active-class="text-red !font-semibold"
            :aria-label="item.label"
          >
            {{ item.label }}
          </router-link>
          <!-- 搜索 -->
          <SearchModal />
          <!-- 主题切换 -->
          <ThemeToggle />
        </div>

        <!-- Mobile: 搜索 + 主题 + 汉堡 -->
        <div class="flex lg:hidden items-center gap-1">
          <SearchModal />
          <ThemeToggle />
          <button
            class="p-2 text-text-muted hover:text-text"
            aria-label="打开菜单"
            :aria-expanded="isMobileMenuOpen"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <span class="sr-only">{{ isMobileMenuOpen ? '关闭菜单' : '打开菜单' }}</span>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                v-if="!isMobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <div
      v-if="isMobileMenuOpen"
      class="lg:hidden fixed inset-0 top-16 bg-bg z-40 overflow-y-auto"
      role="dialog"
      aria-label="移动端导航"
    >
      <div class="px-4 py-4 space-y-2">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="block px-4 py-3 text-lg text-text-muted hover:text-text hover:bg-card rounded-lg transition-colors"
          active-class="text-red !font-semibold bg-card"
          :aria-label="item.label"
          @click="closeMenu"
        >
          {{ item.label }}
        </router-link>
      </div>
    </div>
  </nav>
</template>
