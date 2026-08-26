<script setup lang="ts">
import { ref } from 'vue'

const products = [
  { url: 'media/creative/mascot.jpg', label: '吉祥物', tab: 'mascot' as const },
  { url: 'media/creative/keychain.jpg', label: '钥匙扣', tab: 'keychain' as const },
  { url: 'media/creative/magnet.jpg', label: '冰箱贴', tab: 'magnet' as const },
]

const activeTab = ref<'mascot' | 'keychain' | 'magnet'>('mascot')
const selectedImage = ref(products[0].url)

function switchProduct(tab: 'mascot' | 'keychain' | 'magnet', url: string) {
  activeTab.value = tab
  selectedImage.value = url
}
</script>

<template>
  <div class="bg-card rounded-2xl p-6 shadow-sm">
    <h3 class="font-display text-xl font-bold text-text mb-4">🛍 文创周边预览</h3>

    <!-- 缩略图选择器 -->
    <div class="flex gap-3 mb-6 justify-center">
      <div
        v-for="product in products"
        :key="product.url"
        :class="[
          'w-16 h-16 rounded-lg cursor-pointer border-2 overflow-hidden transition-all',
          activeTab === product.tab
            ? 'border-red'
            : 'border-transparent opacity-70 hover:opacity-100',
        ]"
        @click="switchProduct(product.tab, product.url)"
      >
        <img
          :src="product.url"
          :alt="product.label"
          class="w-full h-full object-cover"
        />
      </div>
    </div>

    <!-- 品类 Tab -->
    <div class="flex gap-2 mb-6 justify-center">
      <button
        :class="[
          'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
          activeTab === 'mascot'
            ? 'bg-red text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-text hover:bg-red-light',
        ]"
        @click="switchProduct('mascot', products[0].url)"
      >
        🧸 吉祥物
      </button>
      <button
        :class="[
          'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
          activeTab === 'keychain'
            ? 'bg-red text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-text hover:bg-red-light',
        ]"
        @click="switchProduct('keychain', products[1].url)"
      >
        🔑 钥匙扣
      </button>
      <button
        :class="[
          'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
          activeTab === 'magnet'
            ? 'bg-red text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-text hover:bg-red-light',
        ]"
        @click="switchProduct('magnet', products[2].url)"
      >
        🧲 冰箱贴
      </button>
    </div>

    <!-- 产品图展示 -->
    <div class="max-w-md mx-auto">
      <div class="rounded-xl overflow-hidden shadow-md">
        <img
          v-if="activeTab === 'mascot'"
          :src="products[0].url"
          alt="吉祥物"
          class="w-full h-auto object-contain max-h-96"
        />
        <img
          v-if="activeTab === 'keychain'"
          :src="products[1].url"
          alt="钥匙扣"
          class="w-full h-auto object-contain max-h-96"
        />
        <img
          v-if="activeTab === 'magnet'"
          :src="products[2].url"
          alt="冰箱贴"
          class="w-full h-auto object-contain max-h-96"
        />
      </div>
      <div class="mt-4 text-center">
        <a
          :href="activeTab === 'mascot' ? products[0].url : activeTab === 'keychain' ? products[1].url : products[2].url"
          :download="activeTab === 'mascot' ? '吉祥物.png' : activeTab === 'keychain' ? '钥匙扣.png' : '冰箱贴.png'"
          class="inline-block px-6 py-2 rounded-lg bg-green text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          📥 下载
        </a>
      </div>
      <p class="text-xs text-text-muted text-center mt-3">
        长按图片可保存至相册，或点击下载按钮保存
      </p>
    </div>
  </div>
</template>
