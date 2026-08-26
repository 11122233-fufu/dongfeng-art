<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import AppNavbar from '@/components/common/AppNavbar.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import BackToTop from '@/components/common/BackToTop.vue'
import { initScrollReveal } from '@/composables/useScrollReveal'

let cleanupReveal: (() => void) | null = null

onMounted(() => {
  cleanupReveal = initScrollReveal()
})

onUnmounted(() => {
  cleanupReveal?.()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-bg text-text">
    <AppNavbar />
    <main class="flex-1">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <div :key="route.path">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </main>
    <AppFooter />
    <BackToTop />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
