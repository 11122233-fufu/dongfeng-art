<script setup lang="ts">
const features = [
  {
    title: '色彩浓烈',
    color: 'text-red',
    bg: 'bg-red/10',
    icon: '🎨',
    desc: '大胆使用高纯度原色，红、黄、绿三原色为主调，色彩对比强烈，视觉冲击力极强，具有浓郁的乡土气息和民间艺术特色。',
  },
  {
    title: '构图饱满',
    color: 'text-yellow',
    bg: 'bg-yellow/10',
    icon: '🖼️',
    desc: '画面不留空白，人物、动植物、建筑等元素密布其中，细节丰富，展现全景式的关东乡土生活画卷。',
  },
  {
    title: '题材广泛',
    color: 'text-green',
    bg: 'bg-green/10',
    icon: '🌾',
    desc: '涵盖农耕劳作、节日庆典、民俗活动、新时代农村建设等多元主题，是关东地区社会变迁的生动影像志。',
  },
  {
    title: '技法独特',
    color: 'text-red',
    bg: 'bg-red/10',
    icon: '🖌️',
    desc: '以水粉颜料在宣纸上作画，吸收剪纸、刺绣、年画等民间艺术元素，线条流畅，造型夸张变形，富有装饰美感。',
  },
  {
    title: '生活气息',
    color: 'text-yellow',
    bg: 'bg-yellow/10',
    icon: '🏠',
    desc: '创作者均为地地道道的农民，他们以亲身经历入画，作品充满对土地、劳动和生活的真挚热爱。',
  },
  {
    title: '文化价值',
    color: 'text-green',
    bg: 'bg-green/10',
    icon: '🏛️',
    desc: '作为国家级非物质文化遗产，东丰农民画承载了关东地区的历史记忆、民俗传统和审美观念，具有重要的文化人类学研究价值。',
  },
]
</script>

<template>
  <section class="py-8" aria-label="艺术特色">
    <h2 class="font-display text-xl text-text mb-6">艺术特色</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="f in features"
        :key="f.title"
        class="bg-card rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
      >
        <span class="text-2xl" aria-hidden="true">{{ f.icon }}</span>
        <h3 class="font-display text-lg mt-2 mb-1" :class="f.color">{{ f.title }}</h3>
        <p class="text-sm text-text-muted leading-relaxed">{{ f.desc }}</p>
      </div>
    </div>
  </section>
</template>
