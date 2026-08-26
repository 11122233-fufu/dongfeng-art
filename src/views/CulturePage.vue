<script setup lang="ts">
import HistoryTimeline from '@/components/culture/HistoryTimeline.vue'
import FeatureCards from '@/components/culture/FeatureCards.vue'
import ReferenceList from '@/components/culture/ReferenceList.vue'

const regionInfo = [
  { label: '所在地', value: '吉林省辽源市东丰县' },
  { label: '非遗级别', value: '国家级非物质文化遗产' },
  { label: '入选年份', value: '2021年（第五批）' },
  { label: '画乡命名', value: '1988年“中国现代民间绘画画乡”' },
  { label: '代表传承人', value: '赵玉山、李俊杰等' },
  { label: '主要技法', value: '水粉、宣纸、布浮雕、沙画等' },
]

const cultureNarratives = [
  {
    title: '历史篇',
    content:
      '东丰县俗称大肚川，位于吉林省中南部。1619年被清太祖爱新觉罗·努尔哈赤辟为盛京围场，1869年正式解禁，成为中国东北最早开放的地方。鹿乡文化为东丰农民画的民间审美和艺术传统奠定了深厚基础。',
  },
  {
    title: '发展篇',
    content:
      '早在一百多年前，黑土地上的农民便因审美需要创造出具有鲜明地方特色的民间艺术。彩棚画、绣花鞋、剪纸、木刻、村头画和毛草纸画等形式逐渐流传，成为农民画的重要源头。',
  },
  {
    title: '崛起篇',
    content:
      '上世纪五六十年代，农民画借助板报、墙头画、年画和宣传画等形式，记录政治运动与生活场景。到了七十年代，创作日趋成熟，东丰农民画开始形成初具风格的审美语言。',
  },
  {
    title: '奋进篇',
    content:
      '改革开放后，东丰农民画创作热情空前高涨，作品以民俗、劳动与日常生活为题材，精品不断涌现。进入二十一世纪，县委县政府持续推动农民画走向产业化、品牌化和乡村振兴。',
  },
  {
    title: '走向世界',
    content:
      '2014年，东丰农民画在联合国总部举办大展，获得国际关注与好评。如今，这项艺术既承载着乡土记忆，也成为展示中国农民画独特魅力、走向世界的重要窗口。',
  },
]
</script>

<template>
  <div class="culture-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Hero -->
    <div class="text-center mb-12">
      <h1 class="font-display text-3xl md:text-4xl text-red mb-4">文化科普</h1>
      <p class="text-text-muted text-lg max-w-2xl mx-auto">
        走进东丰农民画的艺术世界，了解这项国家级非物质文化遗产的历史传承与独特魅力。
      </p>
    </div>

    <!-- 基本信息 -->
    <section class="mb-12" aria-label="基本信息">
      <h2 class="font-display text-xl text-text mb-4">基本概况</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          v-for="info in regionInfo"
          :key="info.label"
          class="bg-card rounded-xl p-4 text-center shadow-sm"
        >
          <p class="text-xs text-text-muted">{{ info.label }}</p>
          <p class="text-sm text-text font-semibold mt-1">{{ info.value }}</p>
        </div>
      </div>
    </section>

    <!-- 文化脉络 -->
    <section class="mb-12" aria-label="文化脉络">
      <h2 class="font-display text-xl text-text mb-6">文化脉络</h2>
      <div class="grid gap-4 lg:grid-cols-2">
        <article
          v-for="item in cultureNarratives"
          :key="item.title"
          class="bg-card rounded-xl p-5 shadow-sm border border-red/10"
        >
          <h3 class="font-display text-lg text-red mb-2">{{ item.title }}</h3>
          <p class="text-sm text-text-muted leading-relaxed">{{ item.content }}</p>
        </article>
      </div>
    </section>

    <!-- 时间线 -->
    <HistoryTimeline />

    <!-- 特色卡片 -->
    <FeatureCards />

    <!-- 参考资料 -->
    <ReferenceList />
  </div>
</template>
