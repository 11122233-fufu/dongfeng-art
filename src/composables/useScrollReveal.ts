/**
 * useScrollReveal — 滚动入场动画观察器
 *
 * 用法：在 App.vue 的 onMounted 中调用 initScrollReveal()
 *       所有带 .anim-fade-up / .anim-fade-in 等类名的元素
 *       进入视口时自动获得 .is-visible 类，触发 CSS transition
 */
import { onMounted, onUnmounted } from 'vue'

/** 选择器：匹配所有入场动画元素 */
const SELECTOR =
  '.anim-fade-up,.anim-fade-in,.anim-fade-left,.anim-fade-right,.anim-scale-in'

/** 默认配置 */
const DEFAULT_OPTIONS: IntersectionObserverInit = {
  threshold: 0.12,           // 元素露出 12% 即触发
  rootMargin: '0px 0px -40px 0px', // 底部提前 40px 触发（元素刚露头就动画）
}

let observer: IntersectionObserver | null = null

function createObserver(options?: IntersectionObserverInit): IntersectionObserver {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        // 动画只播一次，播完停止观察
        obs.unobserve(entry.target)
      }
    })
  }, { ...DEFAULT_OPTIONS, ...options })

  return obs
}

/** 扫描并观察页面中所有动画元素 */
function scanAndObserve(obs: IntersectionObserver): void {
  document.querySelectorAll(SELECTOR).forEach((el) => {
    // 跳过已经在视口中的（立即显示）
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('is-visible')
    } else {
      obs.observe(el)
    }
  })
}

/**
 * 在 App.vue onMounted 中调用此函数，启动全局滚动动画
 *
 * @example
 * // App.vue
 * import { initScrollReveal } from '@/composables/useScrollReveal'
 * onMounted(() => {
 *   initScrollReveal()
 * })
 */
export function initScrollReveal(
  options?: IntersectionObserverInit
): () => void {
  // 销毁旧实例
  if (observer) {
    observer.disconnect()
    observer = null
  }

  observer = createObserver(options)
  scanAndObserve(observer)

  // 监听路由变化（SPA 页面切换后重新扫描）
  const mutationObserver = new MutationObserver(() => {
    if (observer) scanAndObserve(observer)
  })

  mutationObserver.observe(document.getElementById('app')!, {
    childList: true,
    subtree: true,
  })

  // 返回清理函数
  return () => {
    observer?.disconnect()
    observer = null
    mutationObserver.disconnect()
  }
}

/**
 * Vue composable：在 setup 中调用，组件卸载时自动清理
 * 适用于需要在单个组件内独立控制动画的场景
 */
export function useScrollReveal(options?: IntersectionObserverInit) {
  let cleanup: (() => void) | null = null

  onMounted(() => {
    cleanup = initScrollReveal(options)
  })

  onUnmounted(() => {
    cleanup?.()
  })
}
