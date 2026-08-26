import { ref, watch, type Ref } from 'vue'
import paintingsData from '@/data/paintings.json'

interface Painting {
  id: string
  title: string
  author: string
  year: string
  category: string
  description: string
  technique: string
  material: string
  images: { thumbnail: string; full: string }
  audioUrl: string
  analysis: string
  likes: number
  tags: string[]
  copyright: string
}

export interface SearchResult {
  type: 'painting'
  title: string
  excerpt: string
  route: string
}

const data = paintingsData as Painting[]

export function useSearch() {
  const keyword = ref('')
  const query = ref('')
  const results = ref<SearchResult[]>([])
  const isSearching = ref(false)
  let timer: ReturnType<typeof setTimeout> | null = null

  function search(kw: string) {
    keyword.value = kw
    isSearching.value = true

    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      const trimmed = kw.trim()
      if (!trimmed) {
        results.value = []
        isSearching.value = false
        return
      }

      const matched: SearchResult[] = []

      for (const p of data) {
        if (matched.length >= 8) break

        const fields: { key: string; value: string }[] = [
          { key: 'title', value: p.title },
          { key: 'author', value: p.author },
          { key: 'description', value: p.description },
          { key: 'analysis', value: p.analysis },
          { key: 'tags', value: p.tags.join(' ') },
        ]

        for (const field of fields) {
          const idx = field.value.toLowerCase().indexOf(trimmed.toLowerCase())
          if (idx === -1) continue

          const start = Math.max(0, idx - 20)
          const end = Math.min(field.value.length, idx + trimmed.length + 20)
          let excerpt = field.value.slice(start, end)

          // 在匹配部分前后插入 **
          const relIdx = idx - start
          const before = excerpt.slice(0, relIdx)
          const match = excerpt.slice(relIdx, relIdx + trimmed.length)
          const after = excerpt.slice(relIdx + trimmed.length)
          excerpt = before + '**' + match + '**' + after

          if (start > 0) excerpt = '…' + excerpt
          if (end < field.value.length) excerpt = excerpt + '…'

          matched.push({
            type: 'painting',
            title: p.title,
            excerpt,
            route: '/gallery/' + p.id,
          })
          break // 一幅画只匹配一次
        }
      }

      results.value = matched
      isSearching.value = false
    }, 300)
  }

  // 输入即搜索：query 变化时自动触发（内部自带 300ms 防抖）
  watch(query, (v) => search(v))

  return { search, query, results, isSearching, keyword }
}
