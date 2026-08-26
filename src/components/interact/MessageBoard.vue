<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const STORAGE_KEY = 'df_messages'
const NICKNAME_KEY = 'df_nickname'

/* ==================== 类型 ==================== */
interface Message {
  id: string
  nickname: string
  content: string
  createdAt: string
  isAnonymous: boolean
  isPrivate: boolean
}

/* ==================== 状态 ==================== */
const messages = ref<Message[]>([])
const nickname = ref('')
const content = ref('')
const visibleCount = ref(5)

// 新增：匿名 / 公开昵称
const isAnonymous = ref(false)
// 新增：公开留言 / 仅管理员可见
const isPrivate = ref(false)
// 管理员模式
const isAdmin = ref(false)

/* ==================== 管理员入口 ==================== */
let titleClickCount = 0
let titleClickTimer: ReturnType<typeof setTimeout> | null = null

function onTitleClick() {
  titleClickCount++
  if (titleClickTimer) clearTimeout(titleClickTimer)
  if (titleClickCount >= 3) {
    isAdmin.value = !isAdmin.value
    titleClickCount = 0
  } else {
    titleClickTimer = setTimeout(() => { titleClickCount = 0 }, 800)
  }
}

/* ==================== 计算属性 ==================== */
const canSubmit = computed(() => {
  return nickname.value.trim().length > 0 && content.value.trim().length > 0
})

// 根据管理员/游客模式过滤留言
const filteredMessages = computed(() => {
  if (isAdmin.value) return messages.value
  return messages.value.filter((m) => !m.isPrivate)
})

const displayedMessages = computed(() => {
  return filteredMessages.value.slice(0, visibleCount.value)
})

const hasMore = computed(() => {
  return filteredMessages.value.length > visibleCount.value
})

/* ==================== 存储 ==================== */
function loadMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    messages.value = raw ? JSON.parse(raw) : []
  } catch {
    messages.value = []
  }
}

function saveMessages() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value))
}

function loadNickname() {
  const saved = localStorage.getItem(NICKNAME_KEY)
  if (saved) nickname.value = saved
}

function saveNickname() {
  localStorage.setItem(NICKNAME_KEY, nickname.value)
}

/* ==================== 工具 ==================== */
function generateColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colors = [
    '#C53030', '#E53E3E', '#D69E2E', '#38A169',
    '#3182CE', '#805AD5', '#B83280', '#2B6CB0',
    '#2C7A7B', '#C05621',
  ]
  return colors[Math.abs(hash) % colors.length]
}

function formatTime(iso: string): string {
  const now = Date.now()
  const time = new Date(iso).getTime()
  const diff = Math.floor((now - time) / 1000)
  if (diff < 60) return '刚刚'
  if (diff < 3600) return Math.floor(diff / 60) + '分钟前'
  if (diff < 86400) return Math.floor(diff / 3600) + '小时前'
  if (diff < 604800) return Math.floor(diff / 86400) + '天前'
  const d = new Date(iso)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

function getDisplayName(msg: Message): string {
  return msg.isAnonymous ? '匿名访客' : msg.nickname
}

function getAvatarChar(msg: Message): string {
  return msg.isAnonymous ? '匿' : msg.nickname.charAt(0)
}

/* ==================== 操作 ==================== */
function submit() {
  if (!canSubmit.value) return
  saveNickname()
  const msg: Message = {
    id: Date.now() + '-' + Math.random().toString(36).slice(2, 8),
    nickname: nickname.value.trim(),
    content: content.value.trim(),
    createdAt: new Date().toISOString(),
    isAnonymous: isAnonymous.value,
    isPrivate: isPrivate.value,
  }
  messages.value.unshift(msg)
  saveMessages()
  content.value = ''
}

function remove(id: string) {
  if (!confirm('确定要删除这条留言吗？')) return
  messages.value = messages.value.filter((m) => m.id !== id)
  saveMessages()
}

function loadMore() {
  visibleCount.value += 5
}

onMounted(() => {
  loadMessages()
  loadNickname()
})
</script>

<template>
  <div class="bg-card rounded-2xl p-6 shadow-sm">
    <!-- 标题（三击切换管理员） -->
    <h3
      class="font-display text-xl font-bold text-text mb-1 select-none cursor-default"
      @click="onTitleClick"
    >
      💬 访客留言
      <span
        v-if="isAdmin"
        class="ml-2 px-2 py-0.5 text-xs rounded-full bg-red/15 text-red font-normal align-middle"
      >
        🔑 管理员视图
      </span>
    </h3>
    <p class="text-xs text-text-muted mb-4">
      {{ isAdmin ? '当前可查看全部留言（含私密留言）' : '公开留言区 · 友善交流' }}
    </p>

    <!-- 发表区 -->
    <div class="flex flex-col gap-3 mb-6">
      <!-- 昵称行 -->
      <div class="flex flex-wrap items-center gap-3">
        <input
          v-model="nickname"
          type="text"
          maxlength="12"
          placeholder="你的昵称"
          class="w-28 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-red-light"
        />
        <button
          :disabled="!canSubmit"
          :class="[
            'px-5 py-2 rounded-lg text-sm font-medium transition-colors',
            canSubmit
              ? 'bg-red text-white hover:bg-red-light'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed',
          ]"
          @click="submit"
        >
          发表
        </button>
      </div>

      <!-- 匿名 / 公开昵称 -->
      <div class="flex items-center gap-4">
        <span class="text-xs text-text-muted">昵称显示：</span>
        <label class="flex items-center gap-1.5 cursor-pointer">
          <input
            type="radio"
            :value="false"
            v-model="isAnonymous"
            class="accent-red w-3.5 h-3.5"
          />
          <span class="text-xs text-text">公开昵称</span>
        </label>
        <label class="flex items-center gap-1.5 cursor-pointer">
          <input
            type="radio"
            :value="true"
            v-model="isAnonymous"
            class="accent-red w-3.5 h-3.5"
          />
          <span class="text-xs text-text">匿名留言</span>
        </label>
      </div>

      <!-- 公开 / 仅管理员可见 -->
      <div class="flex items-center gap-4">
        <span class="text-xs text-text-muted">留言权限：</span>
        <label class="flex items-center gap-1.5 cursor-pointer">
          <input
            type="radio"
            :value="false"
            v-model="isPrivate"
            class="accent-red w-3.5 h-3.5"
          />
          <span class="text-xs text-text">公开留言</span>
        </label>
        <label class="flex items-center gap-1.5 cursor-pointer">
          <input
            type="radio"
            :value="true"
            v-model="isPrivate"
            class="accent-red w-3.5 h-3.5"
          />
          <span class="text-xs text-text">仅管理员可见</span>
        </label>
      </div>

      <!-- 留言输入 -->
      <textarea
        v-model="content"
        maxlength="200"
        placeholder="写点什么..."
        rows="2"
        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-red-light resize-none"
      />
      <div class="text-xs text-text-muted text-right">
        {{ content.length }}/200
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredMessages.length === 0" class="text-center py-12 text-text-muted">
      <div class="text-4xl mb-3">💬</div>
      <p>还没有留言，来说两句吧</p>
    </div>

    <!-- 留言列表 -->
    <div v-else>
      <div
        v-for="msg in displayedMessages"
        :key="msg.id"
        class="flex gap-3 py-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
      >
        <!-- 头像 -->
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          :style="{ backgroundColor: generateColor(msg.nickname) }"
        >
          {{ getAvatarChar(msg) }}
        </div>
        <!-- 内容 -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="font-medium text-text text-sm truncate">
              {{ getDisplayName(msg) }}
            </span>
            <!-- 私密标签 -->
            <span
              v-if="msg.isPrivate"
              class="text-xs px-1.5 py-0.5 rounded bg-yellow/15 text-yellow font-medium flex-shrink-0"
            >
              🔒 私密
            </span>
            <span class="text-xs text-text-muted flex-shrink-0">{{ formatTime(msg.createdAt) }}</span>
            <button
              class="ml-auto text-text-muted hover:text-red text-xs flex-shrink-0 transition-colors"
              @click="remove(msg.id)"
            >
              ✕
            </button>
          </div>
          <p class="text-sm text-text mt-1 break-words">{{ msg.content }}</p>
        </div>
      </div>

      <!-- 加载更多 -->
      <button
        v-if="hasMore"
        class="w-full text-center text-sm text-text-muted hover:text-red py-3 transition-colors"
        @click="loadMore"
      >
        加载更多（{{ filteredMessages.length - visibleCount }} 条）
      </button>
    </div>
  </div>
</template>
