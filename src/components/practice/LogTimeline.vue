<script setup lang="ts">
// A: 实践日志时间线
import logsData from '@/data/practice-logs.json'
import type { PracticeLog } from '@/types'

const logs: PracticeLog[] = logsData as PracticeLog[]
</script>

<template>
  <section class="py-8" aria-label="实践日志">
    <h2 class="font-display text-xl text-text mb-6">实践日志</h2>
    <div class="relative pl-8 border-l-2 border-green/30 space-y-8">
      <div v-for="log in logs" :key="log.id" class="relative">
        <div class="absolute -left-[2.15rem] top-1 w-3 h-3 rounded-full bg-green" />
        <div class="bg-card rounded-xl p-6 shadow-sm ml-4">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs px-2 py-0.5 rounded bg-green/10 text-green">
              第{{ log.day }}天
            </span>
            <span class="text-xs text-text-muted">{{ log.date }}</span>
            <span class="text-xs text-text-muted">📍 {{ log.location }}</span>
          </div>
          <h3 class="font-display font-semibold text-text mt-2">{{ log.title }}</h3>
          <p class="text-sm text-text-muted mt-2">{{ log.content }}</p>
          <div v-if="log.images.length" class="flex gap-2 mt-3 overflow-x-auto">
            <img
              v-for="(img, idx) in log.images"
              :key="idx"
              :src="img"
              :alt="`${log.title}图片${idx + 1}`"
              class="w-32 h-20 object-cover rounded-lg shrink-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
