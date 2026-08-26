<script setup lang="ts">
interface VideoItem {
  id: string
  title: string
  duration: string
  description: string
  cover: string
  wechatLink: string
}

const props = defineProps<{ video: VideoItem }>()
</script>

<template>
  <!-- 纯展示卡片：二维码 + 外链，无需点击事件 -->
  <div class="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
    <!-- 封面区域 -->
    <div class="aspect-video bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
      <img
        :src="video.cover"
        :alt="video.title"
        loading="lazy"
        class="w-full h-full object-cover"
      />
      <!-- 播放图标蒙层 -->
      <div class="absolute inset-0 flex items-center justify-center bg-black/10">
        <div class="w-14 h-14 rounded-full bg-red/85 flex items-center justify-center text-white text-2xl shadow-lg">
          ▶
        </div>
      </div>
      <!-- 时长角标 -->
      <span
        class="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded"
      >
        {{ video.duration }}
      </span>
    </div>

    <!-- 信息 + 操作区 -->
    <div class="p-4">
      <h3 class="font-display font-semibold text-text truncate">{{ video.title }}</h3>
      <p class="text-sm text-text-muted mt-1 line-clamp-2">{{ video.description }}</p>

      <!-- 分隔线 -->
      <div class="border-t mt-3 pt-3"></div>

      <!-- 操作行：二维码 + 链接 -->
      <div class="flex items-center gap-3">
        <!-- 二维码：api.qrserver.com 在线生成 -->
        <img
          :src="'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=' + encodeURIComponent(video.wechatLink)"
          :alt="video.title + ' 观看二维码'"
          loading="lazy"
          class="w-16 h-16 rounded-lg border shrink-0"
        />
        <div>
          <p class="text-sm font-medium text-text">📱 手机扫码观看</p>
          <p class="mt-0.5">
            或 <a
              :href="video.wechatLink"
              target="_blank"
              rel="noopener noreferrer"
              class="text-green text-xs hover:underline"
            >点击跳转视频号 ↗</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
