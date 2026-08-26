<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{ src: string; alt: string; caption?: string }>()
const emit = defineEmits<{ close: [] }>()

const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
let isDragging = false
let dragStartX = 0
let dragStartY = 0
let lastTranslateX = 0
let lastTranslateY = 0

function resetTransform() {
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
  lastTranslateX = 0
  lastTranslateY = 0
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  const delta = e.deltaY > 0 ? -0.2 : 0.2
  scale.value = Math.max(0.5, Math.min(5, scale.value + delta))
}

function onDblClick() {
  resetTransform()
}

function onMouseDown(e: MouseEvent) {
  isDragging = true
  dragStartX = e.clientX
  dragStartY = e.clientY
  lastTranslateX = translateX.value
  lastTranslateY = translateY.value
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging) return
  translateX.value = lastTranslateX + (e.clientX - dragStartX)
  translateY.value = lastTranslateY + (e.clientY - dragStartY)
}

function onMouseUp() {
  isDragging = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})

watch(
  () => props.src,
  () => resetTransform()
)
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center select-none"
      @click.self="emit('close')"
      @wheel.prevent="onWheel"
    >
      <button
        class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white text-xl transition-colors"
        @click="emit('close')"
        aria-label="关闭"
      >
        ✕
      </button>

      <img
        :src="src"
        :alt="alt"
        class="max-h-[90vh] max-w-[95vw] object-contain cursor-grab active:cursor-grabbing transition-transform duration-200"
        :style="{
          transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
        }"
        @dblclick="onDblClick"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
      />

      <p
        v-if="caption"
        class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/40 px-4 py-1.5 rounded-full whitespace-nowrap"
      >
        {{ caption }}
      </p>
    </div>
  </Teleport>
</template>
