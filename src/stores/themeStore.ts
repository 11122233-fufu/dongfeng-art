import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { ThemeMode } from '@/types'

const STORAGE_KEY = 'df_theme'

function getInitialTheme(): ThemeMode {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'dark' || saved === 'light') return saved
  // 跟随系统偏好
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

function applyTheme(mode: ThemeMode): void {
  const root = document.documentElement
  if (mode === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>(getInitialTheme())
  const isDark = ref(mode.value === 'dark')

  // 初始化时立即应用主题
  applyTheme(mode.value)

  function toggleTheme(): void {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }

  function setTheme(value: ThemeMode): void {
    mode.value = value
  }

  // 监听 mode 变化，同步 isDark + localStorage + DOM
  watch(mode, (newMode) => {
    isDark.value = newMode === 'dark'
    localStorage.setItem(STORAGE_KEY, newMode)
    applyTheme(newMode)
  })

  return {
    mode,
    isDark,
    toggleTheme,
    setTheme,
  }
})
