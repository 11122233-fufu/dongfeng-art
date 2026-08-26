<script setup lang="ts">
import { ref } from 'vue'
import mediaData from '@/data/media.json'
import VideoCard from '@/components/media/VideoCard.vue'
import PhotoGallery from '@/components/media/PhotoGallery.vue'

const activeTab = ref<'video' | 'audio' | 'photo'>('video')
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="font-display text-3xl font-bold text-text mb-6">🎬 多媒体专区</h1>

    <!-- Tab 标签栏 -->
    <div class="flex gap-2 mb-6">
      <button
        :class="[
          'px-5 py-2 rounded-full text-sm font-medium transition-colors',
          activeTab === 'video'
            ? 'bg-red text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-text hover:bg-red-light',
        ]"
        @click="activeTab = 'video'"
      >
        🎬 视频
      </button>
      <button
        :class="[
          'px-5 py-2 rounded-full text-sm font-medium transition-colors',
          activeTab === 'audio'
            ? 'bg-red text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-text hover:bg-red-light',
        ]"
        @click="activeTab = 'audio'"
      >
        🎵 音频
      </button>
      <button
        :class="[
          'px-5 py-2 rounded-full text-sm font-medium transition-colors',
          activeTab === 'photo'
            ? 'bg-red text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-text hover:bg-red-light',
        ]"
        @click="activeTab = 'photo'"
      >
        📸 图集
      </button>
    </div>

    <!-- ==================== 视频标签页 ==================== -->
    <div v-if="activeTab === 'video'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <VideoCard
        v-for="v in mediaData.videos"
        :key="v.id"
        :video="v"
      />
    </div>

    <!-- ==================== 音频标签页 ==================== -->
    <div v-if="activeTab === 'audio'">
      <!-- 分类标签（仅展示） -->
      <div class="flex flex-wrap justify-center gap-2 mb-8">
        <span class="px-4 py-1 text-xs rounded-full bg-red-light/20 text-red">非遗历史</span>
        <span class="px-4 py-1 text-xs rounded-full bg-red-light/20 text-red">文创产业</span>
        <span class="px-4 py-1 text-xs rounded-full bg-red-light/20 text-red">艺术特色</span>
        <span class="px-4 py-1 text-xs rounded-full bg-red-light/20 text-red">乡村振兴</span>
      </div>

      <!--
      ╔══════════════════════════════════════════════════════════════╗
      ║  📁 音频文件配置要求（三步完成，否则播放器无法出声）      ║
      ║  ① 在项目 public/ 目录下新建文件夹：audio                 ║
      ║     完整路径：dongfeng-art/public/audio/                   ║
      ║  ② 将 6 个 m4a 音频文件重命名为：                         ║
      ║     audio1.m4a  audio2.m4a  audio3.m4a                    ║
      ║     audio4.m4a  audio5.m4a  audio6.m4a                    ║
      ║     全部放入 public/audio/ 文件夹                          ║
      ║  ③ 将下方每个音频 src="" 改为对应路径                     ║
      ║     （每张卡片 audio 标签上方注释已标注具体路径）         ║
      ╚══════════════════════════════════════════════════════════════╝
      -->

      <!-- 双栏：左讲解者A + 右讲解者B -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        <!-- ========== 左栏：讲解者A · 浅土黄色底 ========== -->
        <div class="rounded-2xl p-5 md:p-6" style="background: #faf3e6;">
          <h3 class="font-display text-lg font-bold mb-1" style="color: #7a5230;">
            溯源·发展·产业——东丰农民画基础全解
          </h3>
          <p class="text-xs text-text-muted mb-5 pb-4 border-b border-dashed" style="border-color: #d9c8a8;">
            基础产业讲解
          </p>

          <!-- ★ 音频1：此播放器对应 audio1.m4a，手动将下方 src="" 改为 src="/audio/audio1.m4a" 即可播放 -->
          <div class="bg-white rounded-xl p-4 mb-4 shadow-sm relative">
            <!-- src 已指向 /audio/audio1.m4a，需确保 public/audio/ 下有对应文件 -->
            <audio controls preload="none" src="/audio/audio1.m4a" class="w-full mb-3 mt-1">
              您的浏览器不支持音频播放。
            </audio>
            <h4 class="font-bold text-sm mb-1">东丰农民画基础介绍</h4>
            <p class="text-xs text-text-muted leading-relaxed">介绍东丰农民画属地、艺术属性，融合汉满关东民俗的创作风格；梳理起源：1970年代初红石乡红榔头村农民自发组建绘画小组；罗列关键荣誉：1988年获评"中国农民画艺术之乡"、2009年列入吉林省级非遗；重大展出事件：2014年联合国总部精品展、2020年天才妈妈农民画梦想工坊落地，简要点明产业化开端。</p>
          </div>

          <!-- ★ 音频2：此播放器对应 audio2.m4a，手动将下方 src="" 改为 src="/audio/audio2.m4a" 即可播放 -->
          <div class="bg-white rounded-xl p-4 mb-4 shadow-sm relative">
            <!-- src 已指向 /audio/audio2.m4a，需确保 public/audio/ 下有对应文件 -->
            <audio controls preload="none" src="/audio/audio2.m4a" class="w-full mb-3 mt-1">
              您的浏览器不支持音频播放。
            </audio>
            <h4 class="font-bold text-sm mb-1">东丰农民画艺术风格与称号</h4>
            <p class="text-xs text-text-muted leading-relaxed">补充细化艺术特点：形象质朴、色彩明快、构图饱满，兼具凝重和谐的关东风情，黑土民俗特色鲜明；扩充县域文化称号：中国农民画之乡、现代民间绘画画乡、民间文化艺术之乡；明确其作为吉林特色民间绘画、中国民间艺术重要分支的定位，补充非遗基础定位介绍。</p>
          </div>

          <!-- ★ 音频3：此播放器对应 audio3.m4a，手动将下方 src="" 改为 src="/audio/audio3.m4a" 即可播放 -->
          <div class="bg-white rounded-xl p-4 mb-4 shadow-sm relative">
            <!-- src 已指向 /audio/audio3.m4a，需确保 public/audio/ 下有对应文件 -->
            <audio controls preload="none" src="/audio/audio3.m4a" class="w-full mb-3 mt-1">
              您的浏览器不支持音频播放。
            </audio>
            <h4 class="font-bold text-sm mb-1">东丰农民画产业化发展记录</h4>
            <p class="text-xs text-text-muted leading-relaxed">聚焦产业落地细节：2020年天才妈妈工坊带动农村妇女就近就业增收；皇家鹿苑创业园签约50余名本土画师，人均增收五千余元；文创开发方向：丝巾、服饰、手袋文创，陶瓷农民画产业基地融合景德镇陶瓷创新创作；文旅融合模式：农民画+文创+旅游，创业园非遗文创售卖、榆林村发源地乡村文旅体验，完整讲解非遗产业化带动乡村经济的路径。</p>
          </div>
        </div>

        <!-- ========== 右栏：讲解者B · 浅墨绿色底 ========== -->
        <div class="rounded-2xl p-5 md:p-6" style="background: #edf3ee;">
          <h3 class="font-display text-lg font-bold mb-1" style="color: #3d5540;">
            乡土·蜕变·时代——东丰农民画精神内涵赏析
          </h3>
          <p class="text-xs text-text-muted mb-5 pb-4 border-b border-dashed" style="border-color: #c3d3c0;">
            艺术赏析讲解
          </p>

          <!-- ★ 音频4：此播放器对应 audio4.m4a，手动将下方 src="" 改为 src="/audio/audio4.m4a" 即可播放 -->
          <div class="bg-white rounded-xl p-4 mb-4 shadow-sm relative">
            <!-- src 已指向 /audio/audio4.m4a，需确保 public/audio/ 下有对应文件 -->
            <audio controls preload="none" src="/audio/audio4.m4a" class="w-full mb-3 mt-1">
              您的浏览器不支持音频播放。
            </audio>
            <h4 class="font-bold text-sm mb-1">东丰农民画艺术根源与创作底色</h4>
            <p class="text-xs text-text-muted leading-relaxed">点明东丰农民画为黑土地孕育的乡土艺术瑰宝，根植本土乡村；创作者均为本地农民，无专业绘画束缚，以真实农耕生活为创作素材；作品真实还原关东民俗、农事劳作、乡村岁月变迁，阐述艺术来源于民间生活的核心特质。</p>
          </div>

          <!-- ★ 音频5：此播放器对应 audio5.m4a，手动将下方 src="" 改为 src="/audio/audio5.m4a" 即可播放 -->
          <div class="bg-white rounded-xl p-4 mb-4 shadow-sm relative">
            <!-- src 已指向 /audio/audio5.m4a，需确保 public/audio/ 下有对应文件 -->
            <audio controls preload="none" src="/audio/audio5.m4a" class="w-full mb-3 mt-1">
              您的浏览器不支持音频播放。
            </audio>
            <h4 class="font-bold text-sm mb-1">东丰农民画数十年发展蜕变历程</h4>
            <p class="text-xs text-text-muted leading-relaxed">梳理发展蜕变脉络：从早年乡村自娱自乐的民间涂鸦，逐步成长为省级、国家级非遗；本土画师创作聚焦三大主题：关东农耕、鹿乡地域风情、百姓日常幸福生活；讲述小小乡村绘画走出县城、走向全国的发展之路，记录乡村民俗与乡村发展变迁。</p>
          </div>

          <!-- ★ 音频6：此播放器对应 audio6.m4a，手动将下方 src="" 改为 src="/audio/audio6.m4a" 即可播放 -->
          <div class="bg-white rounded-xl p-4 mb-4 shadow-sm relative">
            <!-- src 已指向 /audio/audio6.m4a，需确保 public/audio/ 下有对应文件 -->
            <audio controls preload="none" src="/audio/audio6.m4a" class="w-full mb-3 mt-1">
              您的浏览器不支持音频播放。
            </audio>
            <h4 class="font-bold text-sm mb-1">东丰农民画当代文化价值</h4>
            <p class="text-xs text-text-muted leading-relaxed">讲解新时代东丰农民画创作变化：保留传统乡土底色，新增乡村振兴、时代新风等现代题材；创作意义：以画作记录历史、传递情感；总结文化价值：承载关东百姓生活智慧与精神寄托，是贴合大众、歌颂乡土与新时代的民间艺术典范，也是东丰县标志性文化名片。</p>
          </div>
        </div>

      </div><!-- /双栏 -->

      <!-- 底部总结 -->
      <div class="bg-white rounded-2xl p-6 shadow-sm text-center">
        <h4 class="font-bold text-base mb-2" style="color:#5c3d2e;">社会实践调研总结</h4>
        <p class="text-sm text-text-muted max-w-2xl mx-auto leading-relaxed">
          两组讲解素材相辅相成，一组梳理东丰农民画历史荣誉、产业发展等客观史实，一组深挖艺术创作内核与时代文化意义，完整呈现本次东丰农民画文化展馆社会实践调研成果。
        </p>
      </div>
    </div>

    <!-- ==================== 图集标签页 ==================== -->
    <div v-if="activeTab === 'photo'">
      <PhotoGallery :photos="mediaData.photos" />
    </div>
  </div>
</template>
