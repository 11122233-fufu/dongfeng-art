import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import paintingsData from '@/data/paintings.json'

export interface PaintingImage {
  thumbnail: string
  full: string
}

export interface Painting {
  id: string
  title: string
  author: string
  year: string
  category: '民俗' | '农耕' | '节庆' | '新时代'
  description: string
  technique: string
  material: string
  images: PaintingImage
  audioUrl: string
  analysis: string
  likes: number
  tags: string[]
  copyright: string
}

export const useGalleryStore = defineStore('gallery', () => {
  const allPaintings = ref<Painting[]>(paintingsData as Painting[])

  const filterCategory = ref<string>('全部')
  const filterYear = ref<string | null>(null)
  const filterAuthor = ref<string>('')
  const filterKeyword = ref<string>('')

  const filteredPaintings = computed(() => {
    return allPaintings.value.filter((p) => {
      if (filterCategory.value !== '全部' && p.category !== filterCategory.value) return false
      if (filterYear.value !== null && p.year !== filterYear.value) return false
      if (filterAuthor.value && !p.author.includes(filterAuthor.value)) return false
      if (filterKeyword.value) {
        const kw = filterKeyword.value.toLowerCase()
        const matchTitle = p.title.toLowerCase().includes(kw)
        const matchTags = p.tags.some((t) => t.toLowerCase().includes(kw))
        const matchAnalysis = p.analysis.toLowerCase().includes(kw)
        if (!matchTitle && !matchTags && !matchAnalysis) return false
      }
      return true
    })
  })

  function setCategory(cat: string) {
    filterCategory.value = cat
  }

  function setYear(year: string | null) {
    filterYear.value = year
  }

  function setAuthor(author: string) {
    filterAuthor.value = author
  }

  function setKeyword(keyword: string) {
    filterKeyword.value = keyword
  }

  function resetFilters() {
    filterCategory.value = '全部'
    filterYear.value = null
    filterAuthor.value = ''
    filterKeyword.value = ''
  }

  function getPaintingById(id: string): Painting | undefined {
    return allPaintings.value.find((p) => p.id === id)
  }

  return {
    allPaintings,
    filterCategory,
    filterYear,
    filterAuthor,
    filterKeyword,
    filteredPaintings,
    setCategory,
    setYear,
    setAuthor,
    setKeyword,
    resetFilters,
    getPaintingById,
  }
})
