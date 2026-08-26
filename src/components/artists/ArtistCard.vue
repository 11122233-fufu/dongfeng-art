<script setup lang="ts">
import { ref, computed } from 'vue'

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

const props = defineProps<{
  artist: Artist
}>()

const emit = defineEmits<{
  click: []
}>()

const levelStyle: Record<string, string> = {
  '国家级': 'bg-rose-600 text-white',
  '省级': 'bg-red text-white',
  '市级': 'bg-yellow text-gray-900',
  '县级': 'bg-green text-white',
  '骨干': 'bg-gray-500 text-white',
}

const bioSnippet = computed(() => {
  const s = props.artist.bio
  return s.length > 60 ? s.slice(0, 60) + '…' : s
})

const showWorks = ref(false)
const hasWorks = computed(() => !!props.artist.representativeWorks?.length)
const worksCount = computed(() => props.artist.representativeWorks?.length || 0)

</script>

<template>
  <article
    class="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    @click="emit('click')"
  >
    <!-- 顶部横幅 -->
    <div class="bg-gradient-to-br from-red-light/10 via-yellow-light/10 to-green-light/10 p-6">
      <div class="text-center sm:text-left">
          <h3 class="font-display text-xl font-bold text-text">{{ artist.name }}</h3>
          <p class="text-sm text-red font-medium mt-0.5">{{ artist.title }}</p>
          <span
            class="inline-block mt-1.5 px-3 py-0.5 rounded-full text-xs font-medium"
            :class="levelStyle[artist.level] || 'bg-gray-200 text-gray-700'"
          >
            {{ artist.level === '骨干' ? '骨干创作者' : artist.level + '传承人' }}
          </span>
          <p class="text-xs text-text-muted mt-1">{{ artist.born }} · {{ artist.from }}</p>
        </div>
      </div>

    <!-- 简介 -->
    <div class="px-6 py-4">
      <p class="text-sm text-text-muted leading-relaxed line-clamp-2">{{ artist.bio }}</p>
    </div>

    <!-- 代表作预览（折叠） -->
    <div v-if="hasWorks" class="px-6 pb-2">
      <button
        class="text-sm text-red cursor-pointer flex items-center gap-1"
        @click.stop="showWorks = !showWorks"
      >
        {{ showWorks ? '收起代表作' : `查看代表作（${worksCount}件）` }}
        <span class="text-xs transition-transform" :class="{ 'rotate-180': showWorks }">▼</span>
      </button>
      <div v-if="showWorks" class="mt-2 space-y-1.5">
        <div
          v-for="(work, idx) in artist.representativeWorks"
          :key="idx"
          class="flex items-start gap-2"
        >
          <span class="text-red shrink-0 mt-0.5">◉</span>
          <div>
            <span class="text-sm font-semibold text-text">{{ work.title }}</span>
            <span v-if="work.award" class="text-xs text-text-muted ml-1">{{ work.award }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部 -->
    <div class="px-6 pb-4 pt-3 border-t border-gray-100">
      <p class="text-xs italic text-text-muted truncate">{{ bioSnippet }}</p>
    </div>
  </article>
</template>
