<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

/* ==================== 图片路径 ==================== */
const imageList = [
  'puzzle/pic-01.png',
  'puzzle/pic-02.png',
  'puzzle/pic-03.png',
  'puzzle/pic-04.png',
]

/* ==================== 状态 ==================== */
const gridSize = ref(3)
const tiles = ref<number[]>([])          // tiles[i] = 原图位置编号
const steps = ref(0)
const seconds = ref(0)
const started = ref(false)
const completed = ref(false)
const currentImage = ref('')
const imageError = ref(false)
const imageLoading = ref(true)
let timerId: ReturnType<typeof setInterval> | null = null

/* ==================== 拖拽 / 选择状态 ==================== */
const dragSrcIdx = ref<number | null>(null)   // 正在拖拽的格子索引
const dragOverIdx = ref<number | null>(null)  // 悬停目标索引
const selectedIdx = ref<number | null>(null)  // 点击选中（移动端）

/* ==================== 图片预检 ==================== */
const validImages = ref<string[]>([])

async function precheckImages() {
  const results = await Promise.all(
    imageList.map((src) => {
      return new Promise<string | null>((resolve) => {
        const img = new Image()
        img.onload = () => resolve(src)
        img.onerror = () => resolve(null)
        img.src = src
      })
    })
  )
  validImages.value = results.filter((r): r is string => r !== null)
  if (validImages.value.length === 0) {
    imageError.value = true
    imageLoading.value = false
    return
  }
  currentImage.value = validImages.value[Math.floor(Math.random() * validImages.value.length)]
  imageLoading.value = false
  imageError.value = false
  initGame()
}

/* ==================== 网格计算 ==================== */
const totalTiles = computed(() => gridSize.value * gridSize.value)

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${gridSize.value}, 1fr)`,
}))

/* ==================== 初始化 + 洗牌 ==================== */
function initGame() {
  const n = totalTiles.value
  // 初始正确顺序
  tiles.value = Array.from({ length: n }, (_, i) => i)
  steps.value = 0
  seconds.value = 0
  started.value = false
  completed.value = false
  selectedIdx.value = null
  dragSrcIdx.value = null
  dragOverIdx.value = null
  stopTimer()
  shuffle()
}

function shuffle() {
  const arr = [...tiles.value]
  // Fisher-Yates 随机打乱
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  // 如果碰巧完全正确，再交换一次
  if (arr.every((v, i) => v === i)) {
    ;[arr[0], arr[1]] = [arr[1], arr[0]]
  }
  tiles.value = arr
}

/* ==================== 碎片交换（核心） ==================== */
function swapTiles(a: number, b: number) {
  if (a === b) return
  if (completed.value) return

  const arr = [...tiles.value]
  ;[arr[a], arr[b]] = [arr[b], arr[a]]
  tiles.value = arr

  if (!started.value) {
    started.value = true
    startTimer()
  }
  steps.value++
  checkComplete()
}

/* ==================== 桌面端：HTML5 拖拽 ==================== */
function onDragStart(idx: number, e: DragEvent) {
  if (completed.value) return
  dragSrcIdx.value = idx
  selectedIdx.value = null
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(idx))
  }
}

function onDragOver(idx: number, e: DragEvent) {
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  dragOverIdx.value = idx
}

function onDragLeave(_idx: number) {
  dragOverIdx.value = null
}

function onDrop(idx: number, e: DragEvent) {
  e.preventDefault()
  dragOverIdx.value = null
  if (dragSrcIdx.value !== null) {
    swapTiles(dragSrcIdx.value, idx)
  }
  dragSrcIdx.value = null
}

function onDragEnd() {
  dragSrcIdx.value = null
  dragOverIdx.value = null
}

/* ==================== 移动端 + 通用：点击选中互换 ==================== */
function onTileClick(idx: number) {
  if (completed.value) return
  if (selectedIdx.value === null) {
    // 第一次点击：选中
    selectedIdx.value = idx
  } else if (selectedIdx.value === idx) {
    // 再次点击同一块：取消选中
    selectedIdx.value = null
  } else {
    // 点击不同块：交换
    swapTiles(selectedIdx.value, idx)
    selectedIdx.value = null
  }
}

/* ==================== 完成判定 ==================== */
function checkComplete() {
  if (tiles.value.every((v, i) => v === i)) {
    completed.value = true
    stopTimer()
    selectedIdx.value = null
  }
}

/* ==================== 计时器 ==================== */
function startTimer() {
  timerId = setInterval(() => { seconds.value++ }, 1000)
}
function stopTimer() {
  if (timerId !== null) { clearInterval(timerId); timerId = null }
}
function formatTime(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/* ==================== 换图 / 换难度 ==================== */
function changeImage() {
  if (validImages.value.length === 0) return
  let next: string
  do {
    next = validImages.value[Math.floor(Math.random() * validImages.value.length)]
  } while (next === currentImage.value && validImages.value.length > 1)
  currentImage.value = next
  imageError.value = false
  initGame()
}

function changeDifficulty(size: number) {
  gridSize.value = size
  initGame()
}

/* ==================== 格子背景 + 样式 ==================== */
function tileBg(idx: number): Record<string, string> {
  const val = tiles.value[idx]
  const n = gridSize.value
  const row = Math.floor(val / n)
  const col = val % n
  return {
    backgroundImage: `url(${currentImage.value})`,
    backgroundSize: `${n * 100}% ${n * 100}%`,
    backgroundPosition: `${col * (100 / (n - 1))}% ${row * (100 / (n - 1))}%`,
  }
}

function tileClass(idx: number): Record<string, boolean> {
  const val = tiles.value[idx]
  return {
    'puzzle-tile--selected': selectedIdx.value === idx,
    'puzzle-tile--dragging': dragSrcIdx.value === idx,
    'puzzle-tile--dragover': dragOverIdx.value === idx,
    'puzzle-tile--correct': !completed.value && val === idx,
  }
}

/* ==================== 生命周期 ==================== */
onMounted(() => { precheckImages() })
onUnmounted(() => { stopTimer() })
</script>

<template>
  <div class="bg-card rounded-2xl p-6 shadow-sm relative">
    <!-- 标题 -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-display text-xl font-bold text-text">🧩 拼图游戏</h3>
      <div class="text-sm text-text-muted">
        <span v-if="!started && !completed">⏱ 00:00 · 0 步</span>
        <span v-else>⏱ {{ formatTime(seconds) }} · {{ steps }} 步</span>
      </div>
    </div>

    <!-- 难度选择 -->
    <div class="flex gap-2 mb-4">
      <button
        :class="[
          'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
          gridSize === 3 ? 'bg-red text-white' : 'bg-gray-100 dark:bg-gray-700 text-text hover:bg-red-light',
        ]"
        @click="changeDifficulty(3)"
      >
        3×3 简单
      </button>
      <button
        :class="[
          'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
          gridSize === 4 ? 'bg-red text-white' : 'bg-gray-100 dark:bg-gray-700 text-text hover:bg-red-light',
        ]"
        @click="changeDifficulty(4)"
      >
        4×4 中等
      </button>
      <button
        :class="[
          'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
          gridSize === 5 ? 'bg-red text-white' : 'bg-gray-100 dark:bg-gray-700 text-text hover:bg-red-light',
        ]"
        @click="changeDifficulty(5)"
      >
        5×5 困难
      </button>
    </div>

    <!-- 图片加载错误提示 -->
    <div v-if="imageError" class="mb-4 p-4 rounded-xl bg-yellow/10 border border-yellow/30 text-center">
      <p class="text-sm text-yellow font-medium">⚠️ 拼图图片未加载</p>
      <p class="text-xs text-text-muted mt-1">
        请将 4 张图片放入 public/puzzle/ 目录：pic-01.png ~ pic-04.png
      </p>
    </div>

    <!-- 拼图区域 -->
    <div v-if="!imageError" class="mx-auto" style="max-width: 400px">
      <!-- 加载中 -->
      <div v-if="imageLoading" class="aspect-square rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        <span class="text-text-muted text-sm">加载中...</span>
      </div>

      <!-- 拼图网格 -->
      <div v-else class="grid gap-1.5" :style="gridStyle">
        <div
          v-for="(_, idx) in tiles"
          :key="idx"
          :id="`puzzle-tile-${idx}`"
          draggable="true"
          :class="[
            'aspect-square rounded-md cursor-grab active:cursor-grabbing transition-all duration-150 select-none',
            tileClass(idx),
          ]"
          :style="tileBg(idx)"
          @click="onTileClick(idx)"
          @dragstart="onDragStart(idx, $event)"
          @dragover="onDragOver(idx, $event)"
          @dragleave="onDragLeave(idx)"
          @drop="onDrop(idx, $event)"
          @dragend="onDragEnd"
        />
      </div>

      <!-- 操作提示 -->
      <p class="text-xs text-text-muted text-center mt-3">
        💡 拖拽碎片互换位置 · 或点击两块依次交换
      </p>
    </div>

    <!-- 操作按钮 -->
    <div class="flex gap-3 mt-4 justify-center">
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-text hover:bg-red-light hover:text-white transition-colors"
        @click="initGame()"
      >
        🔄 重新开始
      </button>
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-text hover:bg-red-light hover:text-white transition-colors"
        :disabled="validImages.length <= 1"
        @click="changeImage()"
      >
        🖼 换一张
      </button>
    </div>

    <!-- 完成覆盖层 -->
    <div
      v-if="completed"
      class="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl z-10"
    >
      <div class="bg-card rounded-2xl p-8 text-center shadow-2xl max-w-sm mx-4">
        <div class="text-4xl mb-3">🎉</div>
        <h3 class="font-display text-xl font-bold text-text mb-2">拼图完成！</h3>
        <p class="text-text-muted mb-1">
          用时 <span class="font-medium text-text">{{ formatTime(seconds) }}</span>
        </p>
        <p class="text-text-muted mb-4">
          共 <span class="font-medium text-text">{{ steps }}</span> 步
        </p>
        <button
          class="px-6 py-2 rounded-lg bg-red text-white font-medium hover:bg-red-light transition-colors"
          @click="initGame()"
        >
          再来一局
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 拖拽中 */
.puzzle-tile--dragging {
  opacity: 0.45;
  transform: scale(0.95);
}

/* 拖拽悬停目标 */
.puzzle-tile--dragover {
  box-shadow: 0 0 0 3px #E53E3E;
  transform: scale(1.04);
  z-index: 2;
}

/* 点击选中 */
.puzzle-tile--selected {
  box-shadow: 0 0 0 3px #3182CE;
  transform: scale(1.04);
  z-index: 2;
}

/* 位置已正确 */
.puzzle-tile--correct {
  box-shadow: inset 0 0 0 2px rgba(56, 161, 105, 0.35);
}
</style>
