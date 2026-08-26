<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import paintings from '@/data/paintings.json'
import AnchorNav from '@/components/common/AnchorNav.vue'

/* ===== Hero 轮播数据：3 个主题分组 × 每组 3 张 ===== */
const bannerGroups = [
  {
    label: '画作精选',
    slides: [
      {
        kicker: '国家级非物质文化遗产',
        line1: '机源四方',
        line2: '农墨传芳',
        text: '东丰农民画以最直白的笔触、最浓烈的色彩，记录东北乡村的劳作与生活。',
        image: '/images/banner/painting01.webp',
        alt: '东丰农民画经典作品一',
        color: '#C53030',
        accent: '#F6E05E',
      },
      {
        kicker: '浓墨重彩见真情',
        line1: '一纸丹青',
        line2: '画尽人间烟火',
        text: '从春耕到秋收、从年节到日常，农民用画笔讲述黑土地上的故事。',
        image: '/images/banner/painting02.webp',
        alt: '东丰农民画经典作品二',
        color: '#B83230',
        accent: '#F6AD55',
      },
      {
        kicker: '从田野长出的艺术',
        line1: '扎根乡土',
        line2: '向阳生长',
        text: '每一幅农民画都是生活的切片，朴实、鲜活、充满生命力。',
        image: '/images/banner/painting03.webp',
        alt: '东丰农民画经典作品三',
        color: '#9B2C2C',
        accent: '#FBBF24',
      },
    ],
  },
  {
    label: '馆藏实景',
    slides: [
      {
        kicker: '东丰·中国农民画馆',
        line1: '从纸上到墙上',
        line2: '每一幅都有来处',
        text: '走进画馆，看见原作。那些笔触的厚度、颜色的堆积，只有站在画前才能感受。',
        image: '/images/banner/gallery01.webp',
        alt: '东丰农民画馆展厅实景一',
        color: '#2C5F2C',
        accent: '#F5A623',
      },
      {
        kicker: '沉浸式观展体验',
        line1: '走近原作',
        line2: '感受笔触的温度',
        text: '展厅内百余幅作品陈列，从经典到新作，呈现农民画的完整脉络。',
        image: '/images/banner/gallery02.webp',
        alt: '东丰农民画馆展厅实景二',
        color: '#1E4A2E',
        accent: '#E09B55',
      },
      {
        kicker: '非遗传承阵地',
        line1: '画馆之内',
        line2: '匠心传承不息',
        text: '这里不仅是展示空间，更是创作、教学、交流的非遗传承核心阵地。',
        image: '/images/banner/gallery03.webp',
        alt: '东丰农民画馆展厅实景三',
        color: '#2A4A3A',
        accent: '#D7A348',
      },
    ],
  },
  {
    label: '团队风采',
    slides: [
      {
        kicker: '青年社会实践',
        line1: '我们去现场',
        line2: '找回画里的温度',
        text: '走进东丰，边看边问边记录，让真实的人站到故事中央。',
        image: '/images/banner/team01.webp',
        alt: '社会实践团队在东丰农民画馆合影',
        color: '#2C1810',
        accent: '#E53E3E',
      },
      {
        kicker: '走访调研纪实',
        line1: '深入村落',
        line2: '聆听传承故事',
        text: '拜访老艺人，走进工作坊，用镜头和笔记记录正在发生的传承。',
        image: '/images/banner/team02.webp',
        alt: '团队成员走访传承人工坊',
        color: '#3A2018',
        accent: '#F56565',
      },
      {
        kicker: '施农墨·传芳华',
        line1: '十人同行',
        line2: '共赴非遗之约',
        text: '农墨传芳小队，用脚步丈量黑土地，用行动传播非遗之美。',
        image: '/images/banner/team03.webp',
        alt: '农墨传芳小队在东丰走访记录',
        color: '#1E1010',
        accent: '#FC8181',
      },
    ],
  },
]

/* ===== 双层索引：groupIndex（分组）× slideIndex（组内幻灯片）===== */
const groupIndex = ref(0)
const slideIndex = ref(0)
// 是否自动跨组：true 时组内播完 3 张后延迟自动跳到下一组；false 时组内循环
const autoAdvanceGroup = ref(true)

const currentSlides = computed(() => bannerGroups[groupIndex.value].slides)
const currentSlide = computed(() => currentSlides.value[slideIndex.value])

const isScrolled = ref(false)

let timer: ReturnType<typeof setInterval> | null = null
let groupTimer: ReturnType<typeof setTimeout> | null = null

/* ===== 轮播定时器 ===== */
function startAutoPlay() {
  stopTimer()
  timer = setInterval(() => {
    if (slideIndex.value < 2) {
      slideIndex.value++
    } else {
      // 组内最后一张 → 跳到下一组第一张
      stopTimer()
      if (autoAdvanceGroup.value) {
        groupTimer = setTimeout(() => {
          groupTimer = null
          groupIndex.value = (groupIndex.value + 1) % bannerGroups.length
          slideIndex.value = 0
          startAutoPlay()
        }, 2000)
      } else {
        // 不自动跨组：停留本组，回到第一张继续轮播
        slideIndex.value = 0
        startAutoPlay()
      }
    }
  }, 5000)
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  if (groupTimer) {
    clearTimeout(groupTimer)
    groupTimer = null
  }
}

/* ===== 手动交互 ===== */
function switchGroup(index: number) {
  stopTimer()
  groupIndex.value = index
  slideIndex.value = 0
  startAutoPlay()
}

function switchSlide(index: number) {
  stopTimer()
  slideIndex.value = index
  startAutoPlay()
}

/* 鼠标悬停暂停、移出恢复 */
function onHeroEnter() {
  stopTimer()
}

function onHeroLeave() {
  startAutoPlay()
}

function onScroll() {
  isScrolled.value = window.scrollY > 400
}

onMounted(() => {
  startAutoPlay()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  stopTimer()
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <!-- ===== Hero 首屏：全屏画作背景 ===== -->
  <section id="hero"
    class="relative min-h-screen overflow-hidden flex items-center transition-all duration-1000"
    :class="{ 'opacity-0 pointer-events-none': isScrolled }"
    @mouseenter="onHeroEnter"
    @mouseleave="onHeroLeave"
  >
    <!-- 全屏背景图 -->
    <div class="absolute inset-0 transition-opacity duration-1000">
      <img :key="'bg-' + groupIndex + '-' + slideIndex" :src="currentSlide.image" :alt="currentSlide.alt" class="w-full h-full object-cover" />
    </div>
    <!-- 半透明蒙版：左侧深、右侧浅 -->
    <div class="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30"></div>

    <!-- 文字内容：左对齐，靠左放置 -->
    <div class="relative z-10 w-full">
      <div class="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div class="max-w-xl">
          <Transition name="text-fade" mode="out-in">
            <div :key="groupIndex + '-' + slideIndex">
              <p class="text-accent text-sm font-medium uppercase tracking-wider mb-4">
                <span class="inline-block w-6 h-0.5 bg-accent mr-3 align-middle"></span>
                {{ currentSlide.kicker }}
              </p>
              <h1 class="font-display text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
                {{ currentSlide.line1 }}<br>
                <em class="text-accent not-italic">{{ currentSlide.line2 }}</em>
              </h1>
              <p class="text-white/70 text-base lg:text-lg leading-relaxed mb-8 max-w-md">
                {{ currentSlide.text }}
              </p>
              <div class="flex flex-wrap gap-4">
                <RouterLink to="/gallery" class="inline-flex items-center px-6 py-3 rounded-full font-medium text-white transition-all duration-300 hover:shadow-lg"
                  :style="{ backgroundColor: currentSlide.accent }">
                  探索画作 <span class="ml-2">→</span>
                </RouterLink>
                <RouterLink to="/culture" class="inline-flex items-center text-white/70 border-b border-white/30 pb-0.5 hover:text-white hover:border-white transition-all">
                  了解非遗
                </RouterLink>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- 底部控制栏：分组标签 + 组内圆点 -->
    <div class="absolute bottom-8 left-0 right-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-4">
        <div class="flex items-end gap-3 sm:gap-6">
          <div
            v-for="(group, gi) in bannerGroups"
            :key="'group-' + gi"
            class="flex flex-col items-start gap-1.5 sm:gap-2 cursor-pointer"
            @click="switchGroup(gi)"
          >
            <span
              class="text-xs sm:text-sm transition-colors pb-0.5"
              :class="groupIndex === gi ? 'text-white' : 'text-white/40'"
              :style="groupIndex === gi ? { borderBottom: '2px solid ' + currentSlide.accent } : {}"
            >
              {{ group.label }}
            </span>
            <span class="flex gap-1.5 sm:gap-2">
              <span
                v-for="(s, si) in group.slides"
                :key="'dot-' + gi + '-' + si"
                class="w-1.5 h-1.5 rounded-full transition-colors"
                :class="groupIndex === gi && slideIndex === si ? 'bg-white' : 'bg-white/40'"
                @click.stop="groupIndex === gi && switchSlide(si)"
              ></span>
            </span>
          </div>
        </div>
        <a href="#intro" class="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm shrink-0">
          向下探索 <span class="text-lg">↓</span>
        </a>
      </div>
    </div>
  </section>

  <!-- ===== 提示词 2：简介模块 ===== -->
  <section id="intro" class="py-20 lg:py-28 bg-bg">
    <div class="max-w-7xl mx-auto px-4">
      <div class="mb-12">
        <p class="text-red text-sm font-medium uppercase tracking-wider mb-3">先认识一下</p>
        <h2 class="font-display text-3xl lg:text-4xl font-bold text-text leading-snug">农民画不只挂在墙上，<br />也画着中国人的日子。</h2>
        <p class="text-text-muted mt-4 max-w-xl text-base leading-relaxed">东丰农民画，来自吉林辽源东丰县。它用最直白的笔触、最浓烈的色彩，记录东北乡村的劳作、节庆、民俗和时代新貌。</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <!-- 左侧 -->
        <div class="flex flex-col gap-6">
          <p class="text-text leading-relaxed text-base">
            <b class="font-bold">东丰农民画</b>，始于 20 世纪 50 年代的东北乡土民间绘画。农民一手拿锄头、一手拿画笔，把日常劳作、年节喜庆、邻里故事都画进纸里。2008 年，它被列入国家级非物质文化遗产名录——从此不只是村里墙上的画，更是中国人共同的文化记忆。
          </p>
          <figure class="rounded-xl overflow-hidden shadow-md">
            <img :src="'/images/home/intro.webp'" alt="东丰农民画创作场景或展馆实景" loading="lazy" class="w-full h-56 object-cover" />
          </figure>
          <RouterLink
            to="/culture"
            class="flex items-center justify-center w-28 h-28 rounded-full border-2 border-red text-red font-medium text-sm hover:bg-red hover:text-white transition-all duration-300 shrink-0"
          >
            了解文化<span class="ml-1">↗</span>
          </RouterLink>
        </div>

        <!-- 右侧：三个特征卡片 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
          <article class="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <span class="text-5xl font-display font-bold text-red-light/20">01</span>
            <div class="w-10 h-10 rounded-lg bg-red-light/15 flex items-center justify-center text-red text-xl font-bold mt-2">色</div>
            <h3 class="font-display font-bold text-lg text-text mt-3">浓烈配色</h3>
            <p class="text-sm text-text-muted mt-2 leading-relaxed">红黄绿大胆碰撞，不讲究雅致，只追求热烈——这才是东北人眼里的世界。</p>
          </article>
          <article class="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <span class="text-5xl font-display font-bold text-yellow/20">02</span>
            <div class="w-10 h-10 rounded-lg bg-yellow-light/20 flex items-center justify-center text-yellow text-xl font-bold mt-2">形</div>
            <h3 class="font-display font-bold text-lg text-text mt-3">饱满构图</h3>
            <p class="text-sm text-text-muted mt-2 leading-relaxed">画面不留空白，人物大、场景满，全景式铺开，把所有想说的都画进去。</p>
          </article>
          <article class="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <span class="text-5xl font-display font-bold text-green/20">03</span>
            <div class="w-10 h-10 rounded-lg bg-green-light/20 flex items-center justify-center text-green text-xl font-bold mt-2">意</div>
            <h3 class="font-display font-bold text-lg text-text mt-3">直白叙事</h3>
            <p class="text-sm text-text-muted mt-2 leading-relaxed">画丰收就是堆满粮食，画过年就是满桌饺子。农民画不绕弯，好看就是好看。</p>
          </article>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== 提示词 3 Section 1：快速入口 — 三张彩色卡片 ===== -->
  <section id="entry" class="py-16 bg-card">
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <RouterLink to="/gallery" class="group bg-red rounded-2xl p-6 min-h-[160px] flex items-center justify-between text-white hover:scale-[1.02] transition-transform duration-300">
          <div>
            <span class="text-white/60 text-sm font-mono">01</span>
            <small class="block text-white/50 text-xs mt-4 tracking-widest">PORTFOLIO</small>
            <h3 class="font-display font-bold text-xl mt-1 leading-snug">浏览画作<br />作品展厅</h3>
          </div>
          <span class="text-2xl text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all">→</span>
        </RouterLink>

        <RouterLink to="/interact" class="group bg-yellow rounded-2xl p-6 min-h-[160px] flex items-center justify-between text-white hover:scale-[1.02] transition-transform duration-300">
          <div>
            <span class="text-white/60 text-sm font-mono">02</span>
            <small class="block text-white/50 text-xs mt-4 tracking-widest">INTERACT</small>
            <h3 class="font-display font-bold text-xl mt-1 leading-snug">动手体验<br />在线涂色</h3>
          </div>
          <span class="text-2xl text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all">→</span>
        </RouterLink>

        <RouterLink to="/interact?tab=quiz" class="group bg-green rounded-2xl p-6 min-h-[160px] flex items-center justify-between text-white hover:scale-[1.02] transition-transform duration-300">
          <div>
            <span class="text-white/60 text-sm font-mono">03</span>
            <small class="block text-white/50 text-xs mt-4 tracking-widest">LEARN</small>
            <h3 class="font-display font-bold text-xl mt-1 leading-snug">测测你懂多少<br />非遗知识答题</h3>
          </div>
          <span class="text-2xl text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all">→</span>
        </RouterLink>
      </div>
    </div>
  </section>

  <!-- ===== 提示词 3 Section 2：精选画作 ===== -->
  <section id="featured" class="py-20 lg:py-28 bg-bg">
    <div class="max-w-7xl mx-auto px-4">
      <div class="mb-10">
        <p class="text-red text-sm font-medium uppercase tracking-wider mb-3">线上画廊</p>
        <h2 class="font-display text-3xl lg:text-4xl font-bold text-text leading-snug">精选画作</h2>
        <p class="text-text-muted mt-3 max-w-xl">从农耕劳作到新时代农村，每一幅都是黑土地上的真实故事。</p>
      </div>

      <!-- 桌面端四列网格 -->
      <div class="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-5">
        <article
          v-for="(p, i) in paintings.slice(0, 4)"
          :key="p.id"
          class="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          @click="$router.push('/gallery/' + p.id)"
        >
          <div class="aspect-[4/3] overflow-hidden">
            <img :src="p.images.thumbnail" :alt="p.title" loading="lazy" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div class="p-4">
            <h3 class="font-display font-bold text-text text-sm truncate">{{ p.title }}</h3>
            <p class="text-text-muted text-xs mt-0.5">{{ p.author }} · {{ p.year }}</p>
            <span class="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-red-light/15 text-red">{{ p.category }}</span>
          </div>
        </article>
      </div>

      <!-- 移动端横向滑动 -->
      <div class="sm:hidden flex overflow-x-auto gap-4 snap-x pb-4">
        <article
          v-for="(p, i) in paintings.slice(0, 4)"
          :key="p.id"
          class="snap-start shrink-0 w-[75vw] bg-card rounded-xl overflow-hidden shadow-sm cursor-pointer"
          @click="$router.push('/gallery/' + p.id)"
        >
          <div class="aspect-[4/3] overflow-hidden">
            <img :src="p.images.thumbnail" :alt="p.title" loading="lazy" class="w-full h-full object-cover" />
          </div>
          <div class="p-4">
            <h3 class="font-display font-bold text-text text-sm">{{ p.title }}</h3>
            <p class="text-text-muted text-xs mt-0.5">{{ p.author }} · {{ p.year }}</p>
          </div>
        </article>
      </div>

      <div class="text-center mt-8">
        <RouterLink to="/gallery" class="inline-flex items-center gap-1 text-red font-medium hover:gap-2 transition-all">
          查看全部作品 <span>→</span>
        </RouterLink>
      </div>
    </div>
  </section>

  <!-- ===== 提示词 3 Section 3：数据看板 — 深色背景 ===== -->
  <section id="stats" class="py-20 lg:py-28 bg-[#2C1810] text-white">
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p class="text-yellow/70 text-sm font-medium uppercase tracking-wider mb-3">青年实践 · 数字记录</p>
          <h2 class="font-display text-3xl lg:text-4xl font-bold leading-snug">不是匆匆看过，<br />而是认真留下。</h2>
          <p class="text-white/60 mt-4 max-w-md leading-relaxed">每个数字背后，都是一段真实的相遇。</p>
        </div>
        <div class="grid grid-cols-2 gap-6">
          <div>
            <strong class="text-5xl font-display font-bold text-yellow">40<sup class="text-xl text-yellow/70 ml-1">幅</sup></strong>
            <span class="block text-white/50 text-sm mt-2">经典作品数字整理</span>
          </div>
          <div>
            <strong class="text-5xl font-display font-bold text-yellow">4<sup class="text-xl text-yellow/70 ml-1">位</sup></strong>
            <span class="block text-white/50 text-sm mt-2">非遗传承人受访</span>
          </div>
          <div>
            <strong class="text-5xl font-display font-bold text-yellow">5<sup class="text-xl text-yellow/70 ml-1">次</sup></strong>
            <span class="block text-white/50 text-sm mt-2">深入田野走访</span>
          </div>
          <div>
            <strong class="text-5xl font-display font-bold text-yellow">5000<sup class="text-xl text-yellow/70 ml-1">字</sup></strong>
            <span class="block text-white/50 text-sm mt-2">调研资料归档</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== 提示词 3 Section 5：引言结尾 ===== -->
  <section class="py-24 lg:py-32 bg-card">
    <div class="max-w-3xl mx-auto px-4 text-center">
      <span class="font-display text-8xl lg:text-9xl text-red-light/20 leading-none select-none">"</span>
      <blockquote class="font-display text-2xl lg:text-4xl font-bold text-text leading-relaxed -mt-8">
        农民画不是墙上的一张画，<br />而是黑土地上长出来的颜色。
      </blockquote>
      <RouterLink
        to="/artists"
        class="inline-flex items-center gap-2 mt-10 px-6 py-3 rounded-full border-2 border-red text-red font-medium hover:bg-red hover:text-white transition-all duration-300"
      >
        去认识画画的人 <span>→</span>
      </RouterLink>
    </div>
  </section>

  <AnchorNav />
</template>

<style scoped>
/* Hero 背景图淡入淡出 */
.bg-fade-enter-active {
  transition: opacity 0.8s ease;
}
.bg-fade-leave-active {
  transition: opacity 0.8s ease;
}
.bg-fade-enter-from,
.bg-fade-leave-to {
  opacity: 0;
}

/* Hero 文字淡入淡出 */
.text-fade-enter-active {
  transition: opacity 0.4s ease;
}
.text-fade-leave-active {
  transition: opacity 0.4s ease;
}
.text-fade-enter-from,
.text-fade-leave-to {
  opacity: 0;
}
</style>
