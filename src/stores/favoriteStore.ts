import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'df_favorites'

export const useFavoriteStore = defineStore('favorite', () => {
  function loadFavorites(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  const favorites = ref<string[]>(loadFavorites())

  const count = computed(() => favorites.value.length)

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
  }

  function toggle(id: string) {
    const idx = favorites.value.indexOf(id)
    if (idx === -1) {
      favorites.value.push(id)
    } else {
      favorites.value.splice(idx, 1)
    }
    persist()
  }

  function isFav(id: string): boolean {
    return favorites.value.includes(id)
  }

  function remove(id: string) {
    const idx = favorites.value.indexOf(id)
    if (idx !== -1) {
      favorites.value.splice(idx, 1)
      persist()
    }
  }

  return {
    favorites,
    count,
    toggle,
    isFav,
    remove,
  }
})
