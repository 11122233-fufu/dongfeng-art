<script setup lang="ts">
import { ref } from 'vue'
import teamData from '@/data/team.json'

const { teamName, slogan, practiceTime, practiceLocation, practiceTheme, practicePurpose, members } = teamData

// 记录头像加载失败的名字 → 回退到纯色圆形+姓氏
const avatarFailed = ref<Record<string, boolean>>({})

function onAvatarError(name: string) {
  avatarFailed.value[name] = true
}
</script>

<template>
  <!-- ===== 头部 Hero 区 ===== -->
  <section
    class="relative overflow-hidden rounded-2xl min-h-[320px] lg:min-h-[400px] flex items-center px-8 lg:px-16 py-12"
    :style="{ backgroundColor: members[0].color }"
  >
    <!-- 左侧竖排 slogan -->
    <div
      class="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 text-white/20 text-xl lg:text-3xl font-display font-bold tracking-widest select-none"
      style="writing-mode: vertical-rl;"
    >
      {{ slogan }}
    </div>

    <!-- 主体内容 -->
    <div class="ml-8 lg:ml-16 max-w-3xl">
      <h1 class="font-display text-5xl lg:text-7xl font-bold text-white leading-tight mb-4">
        {{ teamName }}
      </h1>
      <p class="text-white/70 text-base lg:text-lg max-w-xl leading-relaxed mb-6">
        {{ practiceTheme }}
      </p>
      <div class="flex flex-wrap gap-3">
        <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/15 text-white/90 text-sm">
          📍 {{ practiceLocation }}
        </span>
        <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/15 text-white/90 text-sm">
          🕒 {{ practiceTime }}
        </span>
        <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/15 text-white/90 text-sm">
          🎯 实践主题
        </span>
      </div>
    </div>
  </section>

  <!-- ===== 实践目的区 ===== -->
  <section class="py-12 lg:py-16 bg-bg">
    <div class="max-w-4xl mx-auto px-4">
      <div class="flex gap-5">
        <div class="shrink-0 w-1 rounded-full bg-red"></div>
        <p class="font-display text-lg lg:text-xl leading-relaxed text-text">
          {{ practicePurpose }}
        </p>
      </div>
    </div>
  </section>

  <!-- ===== 成员网格区 ===== -->
  <section class="pb-12 lg:pb-16 bg-bg">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="font-display text-2xl lg:text-3xl font-bold text-text mb-8">小队成员</h2>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          v-for="(m, i) in members"
          :key="m.name"
          class="bg-card rounded-xl p-5 shadow-sm hover:shadow-md transition-all text-center relative"
        >
          <!-- 圆形头像 -->
          <div
            class="relative w-20 h-20 rounded-full mx-auto flex items-center justify-center overflow-hidden"
            :style="{ backgroundColor: m.color }"
          >
            <!-- 优先加载照片 -->
            <img
              v-if="m.avatar && !avatarFailed[m.name]"
              :src="m.avatar"
              :alt="m.name"
              class="w-full h-full object-cover"
              @error="onAvatarError(m.name)"
            />
            <!-- 无照片或加载失败 → 默认纯色+姓氏 -->
            <span
              v-else
              class="font-display text-2xl font-bold text-white"
            >{{ m.initials }}</span>
            <!-- 右下角序号 -->
            <span
              class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white text-xs flex items-center justify-center shadow-sm"
              :style="{ color: m.color }"
            >
              {{ i + 1 }}
            </span>
          </div>

          <!-- 姓名 -->
          <h3 class="font-bold text-text text-sm mt-3">{{ m.name }}</h3>
          <!-- 角色 -->
          <p class="text-xs text-text-muted">{{ m.role }}</p>
          <!-- 简介 -->
          <p class="text-xs text-text-muted mt-2 leading-relaxed line-clamp-3">
            {{ m.text }}
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== 分工总览区 ===== -->
  <section class="pb-16 lg:pb-20 bg-bg">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="font-display text-2xl lg:text-3xl font-bold text-text mb-8">分工总览</h2>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          v-for="(m, i) in members"
          :key="'overview-' + i"
          class="bg-card rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mb-2 overflow-hidden relative"
            :style="{ backgroundColor: m.color }"
          >
            <img
              v-if="m.avatar && !avatarFailed[m.name]"
              :src="m.avatar"
              :alt="m.name"
              class="absolute inset-0 w-full h-full object-cover"
              @error="onAvatarError(m.name)"
            />
            <span v-else>{{ m.initials }}</span>
          </div>
          <p class="text-xs text-text-muted mb-0.5">{{ m.role.split('｜')[0] || m.role }}</p>
          <p class="font-bold text-text text-sm">{{ m.name }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
