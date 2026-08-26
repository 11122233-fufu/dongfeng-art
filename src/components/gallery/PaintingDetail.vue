<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useGalleryStore } from '@/stores/galleryStore'
import { useFavoriteStore } from '@/stores/favoriteStore'
import type { Painting } from '@/stores/galleryStore'

const props = defineProps<{ paintingId: string }>()
const emit = defineEmits<{ close: [] }>()

const store = useGalleryStore()
const fav = useFavoriteStore()

const painting = computed(() => store.getPaintingById(props.paintingId))
const currentIndex = computed(() => store.allPaintings.findIndex((p) => p.id === props.paintingId))

const scale = ref(1)

function onWheel(e: WheelEvent) {
  e.preventDefault()
  scale.value = Math.max(0.5, Math.min(4, scale.value + (e.deltaY > 0 ? -0.2 : 0.2)))
}

function resetZoom() {
  scale.value = 1
}

function goPrev() {
  const idx = currentIndex.value - 1
  if (idx >= 0) {
    window.dispatchEvent(new CustomEvent('gallery-nav', { detail: store.allPaintings[idx].id }))
  }
}

function goNext() {
  const idx = currentIndex.value + 1
  if (idx < store.allPaintings.length) {
    window.dispatchEvent(new CustomEvent('gallery-nav', { detail: store.allPaintings[idx].id }))
  }
}

const isSpeaking = ref(false)

function toggleSpeech() {
  if (isSpeaking.value) {
    speechSynthesis.cancel()
    isSpeaking.value = false
    return
  }
  if (!painting.value) return
  const utterance = new SpeechSynthesisUtterance(
    painting.value.title + '。' + painting.value.analysis
  )
  utterance.lang = 'zh-CN'
  utterance.rate = 0.9
  utterance.onend = () => {
    isSpeaking.value = false
  }
  speechSynthesis.speak(utterance)
  isSpeaking.value = true
}

watch(
  () => props.paintingId,
  () => {
    speechSynthesis.cancel()
    isSpeaking.value = false
    resetZoom()
  }
)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowLeft') goPrev()
  if (e.key === 'ArrowRight') goNext()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  speechSynthesis.cancel()
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="painting"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <button
        class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white text-xl transition-colors"
        @click="emit('close')"
        aria-label="关闭"
      >
        ✕
      </button>

      <button
        v-if="currentIndex > 0"
        class="absolute left-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white text-2xl transition-colors"
        @click="goPrev"
        aria-label="上一幅"
      >
        ‹
      </button>

      <button
        v-if="currentIndex < store.allPaintings.length - 1"
        class="absolute right-16 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white text-2xl transition-colors"
        @click="goNext"
        aria-label="下一幅"
      >
        ›
      </button>

      <div
        class="flex flex-col lg:flex-row w-full max-w-6xl max-h-[90vh] mx-4 bg-card rounded-2xl overflow-hidden shadow-2xl"
        @click.stop
      >
        <div class="lg:w-3/5 bg-gray-900 flex items-center justify-center overflow-hidden relative">
          <img
            :src="painting.images.full"
            :alt="painting.title"
            class="max-w-full max-h-[70vh] lg:max-h-[85vh] object-contain cursor-zoom-in"
            :style="{ transform: 'scale(' + scale + ')', transition: 'transform 0.2s' }"
            @wheel.prevent="onWheel"
            @dblclick="resetZoom"
          />
          <span class="absolute bottom-2 left-2 text-xs text-white/50">
            {{ Math.round(scale * 100) }}% · 滚轮缩放 · 双击还原
          </span>
        </div>

        <div class="lg:w-2/5 p-6 overflow-y-auto max-h-[90vh]">
          <h2 class="font-display text-2xl font-bold text-text mb-1">
            《{{ painting.title }}》
          </h2>
          <p class="text-text-muted mb-4">
            {{ painting.author }} · {{ painting.year }}年
          </p>

          <dl class="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mb-4">
            <dt class="text-text-muted text-xs">类别</dt>
            <dd class="text-text font-medium">{{ painting.category }}</dd>
            <dt class="text-text-muted text-xs">技法</dt>
            <dd class="text-text font-medium">{{ painting.technique }}</dd>
            <dt class="text-text-muted text-xs">材质</dt>
            <dd class="text-text font-medium">{{ painting.material }}</dd>
            <dt class="text-text-muted text-xs">标签</dt>
            <dd class="text-text font-medium">{{ painting.tags.join(' · ') }}</dd>
          </dl>

          <p class="text-sm text-text mb-4 leading-relaxed">
            {{ painting.description }}
          </p>

          <div class="bg-bg rounded-lg p-4 mb-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-text">📖 画作赏析</span>
              <button
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                  isSpeaking
                    ? 'bg-red text-white'
                    : 'bg-red-light/20 text-red hover:bg-red hover:text-white',
                ]"
                :aria-label="isSpeaking ? '停止朗读' : '朗读赏析'"
                @click="toggleSpeech"
              >
                {{ isSpeaking ? '⏹ 停止' : '▶ 朗读' }}
              </button>
            </div>
            <p class="text-sm text-text-muted leading-relaxed">
              {{ painting.analysis }}
            </p>
          </div>

          <div class="flex items-center gap-3">
            <button
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                fav.isFav(painting.id)
                  ? 'bg-red text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-text hover:bg-red-light/20',
              ]"
              @click="fav.toggle(painting.id)"
            >
              {{ fav.isFav(painting.id) ? '♥ 已收藏' : '♡ 收藏' }}
            </button>
            <span class="text-xs text-text-muted ml-auto">
              {{ currentIndex + 1 }} / {{ store.allPaintings.length }}
            </span>
          </div>

          <p class="text-xs text-text-muted mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            ⚠ {{ painting.copyright }}
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>
