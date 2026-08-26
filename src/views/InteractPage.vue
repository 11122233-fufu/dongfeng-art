<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ColoringGame from '@/components/interact/ColoringGame.vue'
import PuzzleGame from '@/components/interact/PuzzleGame.vue'
import QuizGame from '@/components/interact/QuizGame.vue'
import MessageBoard from '@/components/interact/MessageBoard.vue'
import CreatorPreview from '@/components/interact/CreatorPreview.vue'

const route = useRoute()
const activeTab = ref<'color' | 'puzzle' | 'quiz' | 'message' | 'creative'>('color')

onMounted(() => {
  if (route.query.tab === 'quiz') {
    activeTab.value = 'quiz'
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="font-display text-3xl font-bold text-text mb-6">🎮 互动体验</h1>

    <div class="flex flex-wrap gap-2 mb-6">
      <button
        :class="[
          'px-5 py-2 rounded-full text-sm font-medium transition-colors',
          activeTab === 'color'
            ? 'bg-red text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-text hover:bg-red-light',
        ]"
        @click="activeTab = 'color'"
      >
        🎨 涂色
      </button>
      <button
        :class="[
          'px-5 py-2 rounded-full text-sm font-medium transition-colors',
          activeTab === 'puzzle'
            ? 'bg-red text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-text hover:bg-red-light',
        ]"
        @click="activeTab = 'puzzle'"
      >
        🧩 拼图
      </button>
      <button
        :class="[
          'px-5 py-2 rounded-full text-sm font-medium transition-colors',
          activeTab === 'quiz'
            ? 'bg-red text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-text hover:bg-red-light',
        ]"
        @click="activeTab = 'quiz'"
      >
        🧠 答题
      </button>
      <button
        :class="[
          'px-5 py-2 rounded-full text-sm font-medium transition-colors',
          activeTab === 'message'
            ? 'bg-red text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-text hover:bg-red-light',
        ]"
        @click="activeTab = 'message'"
      >
        💬 留言
      </button>
      <button
        :class="[
          'px-5 py-2 rounded-full text-sm font-medium transition-colors',
          activeTab === 'creative'
            ? 'bg-red text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-text hover:bg-red-light',
        ]"
        @click="activeTab = 'creative'"
      >
        🛍 文创
      </button>
    </div>

    <ColoringGame v-if="activeTab === 'color'" />
    <PuzzleGame v-if="activeTab === 'puzzle'" />
    <QuizGame v-if="activeTab === 'quiz'" />
    <MessageBoard v-if="activeTab === 'message'" />
    <CreatorPreview v-if="activeTab === 'creative'" />
  </div>
</template>
