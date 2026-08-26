<script setup lang="ts">
const milestones = [
  {
    year: '1619—1869',
    title: '围场与开放',
    desc: '东丰县先后被辟为盛京围场并于1869年正式解禁，鹿乡文化的积淀为农民画的生成提供了浓厚的民间土壤。',
    image: '/paintings/thumb/p001.webp',
    imageAlt: '东丰清代围场、鹿乡历史图景',
  },
  {
    year: '20世纪50—70年代',
    title: '萌芽与形成',
    desc: '农民借板报、墙头画、年画与宣传画记录生活与政治运动，画面逐渐从传统民间图式走向带有现代表达的农民画。',
    image: '/paintings/thumb/p004.webp',
    imageAlt: '早期墙头画、农民板报老照片',
  },
  {
    year: '1980—1990年代',
    title: '崛起与繁荣',
    desc: '随着改革开放深入，东丰农民画创作热情高涨，作品以民俗、劳动、日常为题材，1988年更被命名为"现代民间绘画画乡"。',
    image: '/paintings/thumb/p007.webp',
    imageAlt: '早期农民画家创作、旧画展实拍',
  },
  {
    year: '21世纪初',
    title: '传承与发展',
    desc: '农民画被列入非遗保护体系，县域层面持续加强创作、培训与展示，作品在全国与世界舞台上不断发声。',
    image: '/paintings/thumb/p010.webp',
    imageAlt: '非遗培训班、画室创作现场照片',
  },
  {
    year: '当下',
    title: '创新与走向世界',
    desc: '在乡村振兴和文化传播的推动下，东丰农民画不断融合新材料、新形式与现代审美，成为连接传统与时代的重要艺术品牌。',
    image: '/paintings/thumb/p013.webp',
    imageAlt: '现代农民画作品、文创与对外文化交流活动',
  },
]
</script>

<template>
  <section class="py-8" aria-label="发展历史">
    <h2 class="font-display text-xl text-text mb-6">发展历程</h2>
    <div class="relative pl-8 border-l-2 border-red/30 space-y-8">
      <div v-for="(m, idx) in milestones" :key="idx" class="relative">
        <div
          class="absolute -left-[2.15rem] top-1 w-3 h-3 rounded-full"
          :class="idx === 0 ? 'bg-red' : 'bg-red/40'"
        />
        <!-- 响应式图文卡片 -->
        <div class="bg-card rounded-xl p-5 shadow-sm ml-4 flex flex-col-reverse md:flex-row gap-5">
          <!-- 文字区域 -->
          <div class="flex-1 min-w-0">
            <span class="text-xs px-2 py-0.5 rounded bg-red/10 text-red font-semibold">
              {{ m.year }}
            </span>
            <h3 class="font-display font-semibold text-text mt-2">{{ m.title }}</h3>
            <p class="text-sm text-text-muted mt-1">{{ m.desc }}</p>
          </div>
          <!-- 图片区域 -->
          <div class="md:w-48 shrink-0">
            <img
              :src="m.image"
              :alt="m.imageAlt"
              loading="lazy"
              class="rounded-lg w-full h-40 md:h-32 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
