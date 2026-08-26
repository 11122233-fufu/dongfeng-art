<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import artistsData from '@/data/artists.json'
import ArtistCard from '@/components/artists/ArtistCard.vue'

interface RepresentativeWork {
  title: string
  year?: number | string
  award?: string
}

interface Artist {
  id: string
  name: string
  title: string
  born: string
  from: string
  level: string
  avatar: string
  bio: string
  story: string
  representativeWorks?: RepresentativeWork[]
  interviewVideo?: string
  interviewAudio?: string
  interviewText?: string
  photos?: string[]
}

const artists = artistsData as Artist[]
const selectedArtist = ref<Artist | null>(null)

document.title = '创作者故事 - 东丰农民画文化展馆'

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') selectedArtist.value = null
}

function onBackdropClick(e: MouseEvent) {
  if ((e.target as HTMLElement).dataset?.backdrop) selectedArtist.value = null
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

function levelClass(level: string): string {
  return level === '国家级' ? 'bg-rose-600 text-white'
    : level === '省级' ? 'bg-red text-white'
    : level === '市级' ? 'bg-yellow text-gray-900'
    : level === '县级' ? 'bg-green text-white'
    : 'bg-gray-500 text-white'
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- 标题 -->
    <h1 class="font-display text-3xl font-bold text-text">👨‍🎨 创作者故事</h1>
    <p class="text-text-muted mt-1 mb-8">东丰农民画的守护者与传承者</p>

    <!-- 网格 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <ArtistCard
        v-for="artist in artists"
        :key="artist.id"
        :artist="artist"
        @click="selectedArtist = artist"
      />
    </div>

    <!-- 详情模态 -->
    <Teleport to="body">
      <div
        v-if="selectedArtist"
        class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
        data-backdrop
        @click="onBackdropClick"
      >
        <div
          class="bg-card rounded-2xl max-w-3xl w-[90vw] mx-auto mt-12 mb-8 max-h-[85vh] overflow-y-auto p-6 lg:p-8 relative"
        >
          <!-- 关闭 -->
          <button
            class="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-lg transition-colors"
            @click="selectedArtist = null"
            aria-label="关闭"
          >
            ✕
          </button>

          <!-- 头部 -->
          <div class="mb-6">
            <div>
              <h2 class="font-display text-2xl font-bold text-text">{{ selectedArtist.name }}</h2>
              <p class="text-sm text-red font-medium mt-0.5">{{ selectedArtist.title }}</p>
              <span
                class="inline-block mt-1.5 px-3 py-0.5 rounded-full text-xs font-medium"
                :class="levelClass(selectedArtist.level)"
              >
                {{ selectedArtist.level === '骨干' ? '骨干创作者' : selectedArtist.level + '传承人' }}
              </span>
              <p class="text-xs text-text-muted mt-1">{{ selectedArtist.born }} · {{ selectedArtist.from }}</p>
            </div>
          </div>

          <!-- 简介 -->
          <p class="text-sm text-text-muted leading-relaxed mb-6">{{ selectedArtist.bio }}</p>

          <!-- 传承故事 -->
          <h3 class="font-bold text-lg mb-2">📖 传承故事</h3>
          <p class="text-text leading-relaxed">{{ selectedArtist.story }}</p>

          <!-- 代表作品 -->
          <h3 v-if="selectedArtist.representativeWorks?.length" class="font-bold text-lg mt-6 mb-2">
            🏆 代表作品
          </h3>
          <ul v-if="selectedArtist.representativeWorks?.length" class="space-y-2">
            <li
              v-for="(work, idx) in selectedArtist.representativeWorks"
              :key="idx"
              class="flex items-baseline gap-2"
            >
              <span class="font-semibold text-text">{{ work.title }}</span>
              <span v-if="work.award" class="text-xs text-red">{{ work.award }}</span>
            </li>
          </ul>

          <!-- 媒体 -->
          <div v-if="selectedArtist.interviewVideo || selectedArtist.interviewAudio" class="flex flex-wrap gap-3 mt-6">
            <a
              v-if="selectedArtist.interviewVideo"
              :href="selectedArtist.interviewVideo"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-red/10 text-red hover:bg-red/20 transition-colors"
            >
              📹 观看采访视频
            </a>
            <a
              v-if="selectedArtist.interviewAudio"
              :href="selectedArtist.interviewAudio"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-gray-100 text-text-muted hover:bg-gray-200 transition-colors"
            >
              🎙 收听采访录音
            </a>
          </div>

          <!-- 底部关闭 -->
          <div class="text-center pt-6">
            <button
              class="bg-gray-200 hover:bg-gray-300 rounded-lg px-6 py-2 text-sm text-text transition-colors"
              @click="selectedArtist = null"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
