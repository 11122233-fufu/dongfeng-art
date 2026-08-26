// ========== 7.1 画作（B 维护 paintings.json） ==========
export interface Painting {
  id: string
  title: string
  author: string
  year: number
  category: '民俗' | '农耕' | '节庆' | '新时代'
  description: string
  technique: string
  material: string
  images: {
    thumbnail: string  // /paintings/thumb/p001.webp
    full: string       // /paintings/full/p001.webp
  }
  audioUrl: string
  analysis: string
  likes: number
  tags: string[]
  copyright: string
}

// ========== 7.2 创作者（A 维护 artists.json） ==========
export interface Artist {
  id: string
  name: string
  avatar: string
  birthYear: number
  level: '国家级' | '省级' | '市级' | '民间'
  bio: string
  story: string
  masterpieces: string[]
  interviewVideo?: string
  photos: string[]
}

// ========== 7.3 实践日志（A 维护 practice-logs.json） ==========
export interface PracticeLog {
  id: string
  day: number
  title: string
  content: string
  images: string[]
  date: string
  location: string
}

// ========== 7.4 站点配置（A 维护 site-config.json） ==========
export interface SiteConfig {
  siteName: string
  description: string
  footerCopyright: string
  socialLinks: {
    github: string
    email: string
  }
}

// ========== 8.1 useSearch 协作接口 ==========
export interface SearchResult {
  type: 'painting' | 'artist' | 'culture' | 'log'
  title: string
  excerpt: string  // 匹配摘要，最多 50 字
  route: string    // 点击跳转路径
}

// ========== 主题类型 ==========
export type ThemeMode = 'light' | 'dark'

// ========== 画作筛选参数 ==========
export interface GalleryFilter {
  category: string
  year: number | null
  author: string
}
