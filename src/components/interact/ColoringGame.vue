<script setup lang="ts">
import { ref, onMounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const W = 800
const H = 600

/* ==================== 离屏线稿层（仅作边界参考，不参与填色） ==================== */
let outlineCanvas: HTMLCanvasElement | null = null
let outlineCtx: CanvasRenderingContext2D | null = null
let outlineImageData: ImageData | null = null

/* ==================== 离屏填色层（只存用户填色，初始为白色） ==================== */
let colorCanvas: HTMLCanvasElement | null = null
let colorCtx: CanvasRenderingContext2D | null = null

function ensureLayers() {
  if (!outlineCanvas) {
    outlineCanvas = document.createElement('canvas')
    outlineCanvas.width = W
    outlineCanvas.height = H
    outlineCtx = outlineCanvas.getContext('2d')!
  }
  if (!colorCanvas) {
    colorCanvas = document.createElement('canvas')
    colorCanvas.width = W
    colorCanvas.height = H
    colorCtx = colorCanvas.getContext('2d')!
    colorCtx.fillStyle = '#FFFFFF'
    colorCtx.fillRect(0, 0, W, H)
  }
}

/* ==================== 4张线稿素材 ==================== */
interface LineTemplate { name: string; src: string }
const lineTemplates: LineTemplate[] = [
  { name: '\u{1F3A8} 硕果丰收', src: '/coloring/line-01.jpg' },
  { name: '\u{1F3A8} 民俗舞狮', src: '/coloring/line-02.jpg' },
  { name: '\u{1F3A8} 瑞鹿呈祥', src: '/coloring/line-03.jpg' },
  { name: '\u{1F3A8} 乡俗童趣', src: '/coloring/line-04.jpg' },
]

/* ==================== 预加载图片缓存 ==================== */
const imageCache = new Map<number, HTMLImageElement>()
const imagesReady = ref(false)

function preloadAllImages(): Promise<void> {
  const promises = lineTemplates.map((t, i) => {
    return new Promise<void>((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => { imageCache.set(i, img); resolve() }
      img.onerror = () => { console.warn(`线稿加载失败: ${t.src}`); resolve() }
      img.src = t.src
    })
  })
  return Promise.all(promises).then(() => { imagesReady.value = true })
}

/* ==================== 调色板 ==================== */
interface ColorGroup { label: string; colors: string[] }
const colorGroups: ColorGroup[] = [
  { label: '红色系',   colors: ['#9B2C2C','#C53030','#E53E3E','#F56565','#FC8181','#FF6B6B'] },
  { label: '橙黄色系', colors: ['#DD6B20','#ED8936','#F59E0B','#F6AD55','#FBBF24','#F6E05E','#FFD700'] },
  { label: '绿色系',   colors: ['#276749','#2F855A','#38A169','#48BB78','#68D391','#9AE6B4','#C6F6D5'] },
  { label: '蓝色系',   colors: ['#1E40AF','#2B6CB0','#3182CE','#4299E1','#63B3ED','#90CDF4'] },
  { label: '紫色系',   colors: ['#6B46C1','#805AD5','#9F7AEA','#B794F4','#D6BCFA'] },
  { label: '棕土色系', colors: ['#6B3410','#8B4513','#A0522D','#CD853F','#D2691E','#DEB887'] },
  { label: '特殊色',   colors: ['#1A1A1A','#4A5568','#FFFFFF','#FF1493','#00CED1'] },
]

const selectedColor = ref('#E53E3E')
const currentIndex = ref(0)

/* ==================== 撤销栈（存填色层快照） ==================== */
const MAX_UNDO = 30
const undoStack = ref<ImageData[]>([])

function saveSnapshot() {
  if (!colorCtx) return
  undoStack.value.push(colorCtx.getImageData(0, 0, W, H))
  if (undoStack.value.length > MAX_UNDO) undoStack.value.shift()
}

function undo() {
  if (undoStack.value.length <= 1) return
  undoStack.value.pop()
  const prev = undoStack.value[undoStack.value.length - 1]
  if (!colorCtx) return
  colorCtx.putImageData(prev, 0, 0)
  compositeToMain()
}

/* ==================== 合成显示：主画布 = 填色层 + 线稿层（线稿在上） ==================== */
function compositeToMain() {
  const canvas = canvasRef.value
  if (!canvas || !colorCanvas || !outlineCanvas) return
  const c = canvas.getContext('2d')!
  c.clearRect(0, 0, W, H)
  c.drawImage(colorCanvas, 0, 0)
  c.drawImage(outlineCanvas, 0, 0)
}

/* ==================== 渲染线稿到离屏层（一次性） ==================== */
function renderOutline(img: HTMLImageElement) {
  ensureLayers()
  const c = outlineCtx!
  c.clearRect(0, 0, W, H)
  // 注意：不填充白色底，保持透明

  // 等比例缩放绘制线稿
  const scale = Math.min(W / img.naturalWidth, H / img.naturalHeight)
  const dw = img.naturalWidth * scale
  const dh = img.naturalHeight * scale
  const dx = (W - dw) / 2
  const dy = (H - dh) / 2
  c.drawImage(img, dx, dy, dw, dh)

  // 关键：把白底转透明，只保留黑色线条
  const imageData = c.getImageData(0, 0, W, H)
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b
    if (brightness > 160) {
      // 浅色（白底）→ 透明，但 RGB 设为白色，避免边界检测误判
      data[i] = 255; data[i + 1] = 255; data[i + 2] = 255; data[i + 3] = 0
    } else {
      // 深色（线条）→ 纯黑，不透明
      data[i] = 0; data[i + 1] = 0; data[i + 2] = 0; data[i + 3] = 255
    }
  }
  c.putImageData(imageData, 0, 0)

  // 缓存二值化像素数据供填色边界检测。
  // 注意：不能用 canvas 重读 —— 画布按预乘 alpha 存储，alpha=0 的像素 RGB 会被丢弃（读回 (0,0,0,0)），
  // 被 isOutline 误判为轮廓线，导致泛洪填充被全部拒绝。直接引用修改后的 ImageData 对象，RGB 得以保留。
  outlineImageData = imageData
}

/* ==================== 初始化画布 ==================== */
function initCanvas(index: number) {
  ensureLayers()
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = W
  canvas.height = H

  // 清空填色层
  const cc = colorCtx!
  cc.fillStyle = '#FFFFFF'
  cc.fillRect(0, 0, W, H)

  const img = imageCache.get(index)
  if (img) {
    renderOutline(img)
  } else {
    const oc = outlineCtx!
    oc.clearRect(0, 0, W, H)
    oc.fillStyle = '#FFFFFF'
    oc.fillRect(0, 0, W, H)
    oc.fillStyle = '#1A1A1A'
    oc.font = '18px sans-serif'
    oc.textAlign = 'center'
    oc.fillText(`线稿未加载：${lineTemplates[index].src}`, W / 2, H / 2)
    outlineImageData = oc.getImageData(0, 0, W, H)
  }

  compositeToMain()
  undoStack.value = []
  saveSnapshot()
}

/* ==================== 切换线稿 ==================== */
function switchTo(index: number) {
  if (index === currentIndex.value) return
  currentIndex.value = index
  initCanvas(index)
}

/* ==================== 重置 ==================== */
function clearAll() {
  initCanvas(currentIndex.value)
}

/* ==================== 油漆桶填充（填色层 + 线稿层边界） ==================== */
function hexToRgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]
}

// 判断像素是否属于线稿轮廓（黑色/深色=边界，不填充）
function isOutline(r: number, g: number, b: number): boolean {
  // 亮度低于阈值视为轮廓线
  const brightness = 0.299 * r + 0.587 * g + 0.114 * b
  return brightness < 80
}

function floodFillAt(sx: number, sy: number) {
  if (!outlineImageData || !colorCtx) return

  // 1. 检查点击位置是否在轮廓线上
  const outlineData = outlineImageData.data
  const oi = (sy * W + sx) * 4
  if (isOutline(outlineData[oi], outlineData[oi + 1], outlineData[oi + 2])) return

  // 2. 读取填色层当前像素作为目标色
  const colorData = colorCtx.getImageData(0, 0, W, H)
  const cd = colorData.data
  const ci = (sy * W + sx) * 4
  const tR = cd[ci]; const tG = cd[ci + 1]; const tB = cd[ci + 2]

  // 3. 目标色与选中颜色相同则跳过
  const [fR, fG, fB] = hexToRgb(selectedColor.value)
  if (Math.abs(tR - fR) < 3 && Math.abs(tG - fG) < 3 && Math.abs(tB - fB) < 3) return

  // 4. 宽容差匹配（适配 JPG 线稿抗锯齿 / 压缩伪影）
  const TOLERANCE = 96
  function matchTarget(r: number, g: number, b: number): boolean {
    return Math.abs(r - tR) <= TOLERANCE && Math.abs(g - tG) <= TOLERANCE && Math.abs(b - tB) <= TOLERANCE
  }

  // 5. 扫描线泛洪（检查填色层 + 线稿层双重边界）
  const width = W; const height = H
  const visited = new Uint8Array(width * height)
  const queue: [number, number][] = [[sx, sy]]
  let head = 0

  while (head < queue.length) {
    const [x, y] = queue[head++]
    if (x < 0 || x >= width || y < 0 || y >= height) continue
    const vi = y * width + x
    if (visited[vi]) continue

    const pi = vi * 4
    // 线稿边界检测
    if (isOutline(outlineData[pi], outlineData[pi + 1], outlineData[pi + 2])) continue
    // 颜色匹配检测
    if (!matchTarget(cd[pi], cd[pi + 1], cd[pi + 2])) continue

    // 向左扩展
    let left = x
    while (left > 0) {
      const li = (y * width + (left - 1)) * 4
      if (isOutline(outlineData[li], outlineData[li + 1], outlineData[li + 2])) break
      if (!matchTarget(cd[li], cd[li + 1], cd[li + 2])) break
      if (visited[y * width + (left - 1)]) break
      left--
    }
    // 向右扩展
    let right = x
    while (right < width - 1) {
      const ri = (y * width + (right + 1)) * 4
      if (isOutline(outlineData[ri], outlineData[ri + 1], outlineData[ri + 2])) break
      if (!matchTarget(cd[ri], cd[ri + 1], cd[ri + 2])) break
      if (visited[y * width + (right + 1)]) break
      right++
    }

    // 填充该行
    for (let col = left; col <= right; col++) {
      const fi = (y * width + col) * 4
      cd[fi] = fR; cd[fi + 1] = fG; cd[fi + 2] = fB; cd[fi + 3] = 255
      visited[y * width + col] = 1
    }

    // 扫描上下行
    for (let col = left; col <= right; col++) {
      if (y > 0 && !visited[(y - 1) * width + col]) {
        const ai = ((y - 1) * width + col) * 4
        if (!isOutline(outlineData[ai], outlineData[ai + 1], outlineData[ai + 2]) &&
            matchTarget(cd[ai], cd[ai + 1], cd[ai + 2])) {
          queue.push([col, y - 1])
        }
      }
      if (y < height - 1 && !visited[(y + 1) * width + col]) {
        const bi = ((y + 1) * width + col) * 4
        if (!isOutline(outlineData[bi], outlineData[bi + 1], outlineData[bi + 2]) &&
            matchTarget(cd[bi], cd[bi + 1], cd[bi + 2])) {
          queue.push([col, y + 1])
        }
      }
    }
  }

  // 6. 写回填色层
  colorCtx.putImageData(colorData, 0, 0)
  // 7. 合成显示
  compositeToMain()
  saveSnapshot()
}

/* ==================== 坐标换算 ==================== */
function canvasPos(e: MouseEvent | Touch): { x: number; y: number } {
  const canvas = canvasRef.value!
  const rect = canvas.getBoundingClientRect()
  return {
    x: Math.round(((e.clientX - rect.left) / rect.width) * W),
    y: Math.round(((e.clientY - rect.top) / rect.height) * H),
  }
}

function onClick(e: MouseEvent) {
  const { x, y } = canvasPos(e)
  floodFillAt(x, y)
}

function onTouchTap(e: TouchEvent) {
  e.preventDefault()
  if (e.changedTouches.length === 1) {
    const { x, y } = canvasPos(e.changedTouches[0])
    floodFillAt(x, y)
  }
}

/* ==================== 保存图片 ==================== */
function saveImage() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `东丰农民画涂色_线稿${currentIndex.value + 1}.png`
    a.click()
    URL.revokeObjectURL(url)
  })
}

/* ==================== 初始化 ==================== */
onMounted(async () => {
  ensureLayers()
  initCanvas(0)
  await preloadAllImages()
  initCanvas(currentIndex.value)
})
</script>

<template>
  <div class="bg-card rounded-2xl p-6 shadow-sm">
    <h3 class="font-display text-xl font-bold text-text mb-4">🎨 在线涂色体验</h3>

    <!-- 线稿切换按钮 -->
    <div class="flex flex-wrap gap-2 mb-4">
      <button
        v-for="(t, i) in lineTemplates"
        :key="i"
        :class="[
          'px-5 py-2 rounded-full text-sm font-medium transition-colors',
          currentIndex === i
            ? 'bg-red text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-text hover:bg-red-light hover:text-white',
        ]"
        @click="switchTo(i)"
      >
        {{ t.name }}
      </button>
    </div>

    <!-- 画布 -->
    <div class="bg-white rounded-xl overflow-hidden border mx-auto" style="max-width: 100%">
      <canvas
        ref="canvasRef"
        class="block w-full touch-none cursor-crosshair"
        style="aspect-ratio: 800 / 600"
        @click="onClick"
        @touchend="onTouchTap"
      />
    </div>

    <!-- 调色板 + 控制栏 -->
    <div class="mt-4 space-y-4">
      <div v-for="group in colorGroups" :key="group.label" class="flex flex-wrap items-center gap-2">
        <span class="text-xs text-text-muted w-16 shrink-0">{{ group.label }}</span>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="c in group.colors"
            :key="c"
            :style="{ backgroundColor: c }"
            :title="c"
            :class="[
              'w-8 h-8 rounded-full border-2 transition-transform cursor-pointer',
              selectedColor === c
                ? 'border-gray-800 dark:border-white scale-125 shadow-md'
                : c === '#FFFFFF'
                  ? 'border-gray-300'
                  : 'border-gray-300/50 hover:scale-115',
            ]"
            @click="selectedColor = c"
          />
        </div>
      </div>

      <div class="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-2 mr-2">
          <span
            class="w-6 h-6 rounded-full border border-gray-400"
            :style="{ backgroundColor: selectedColor }"
          />
          <span class="text-xs text-text-muted font-mono">{{ selectedColor }}</span>
        </div>
        <button
          class="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-text hover:bg-gray-600 hover:text-white transition-colors disabled:opacity-40"
          :disabled="undoStack.length <= 1"
          @click="undo"
        >
          ↩️ 撤销
        </button>
        <button
          class="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-text hover:bg-gray-600 hover:text-white transition-colors"
          @click="clearAll"
        >
          🗑️ 重置
        </button>
        <button
          class="px-3 py-1.5 rounded-lg text-xs font-medium bg-green text-white hover:opacity-90 transition-opacity"
          @click="saveImage"
        >
          💾 保存作品
        </button>
      </div>
    </div>
  </div>
</template>
