<script setup lang="ts">
import { ref, computed } from 'vue'
import quizData from '@/data/quiz.json'

interface Question {
  question: string
  options: string[]
  answer: number
  explanation: string
}

const questions = ref<Question[]>([])
const currentIndex = ref(0)
const score = ref(0)
const correctCount = ref(0)
const selectedOption = ref<number | null>(null)
const answered = ref(false)
const finished = ref(false)

const currentQuestion = computed(() => questions.value[currentIndex.value] ?? null)

const progressPercent = computed(() => {
  if (finished.value) return 100
  return (currentIndex.value / questions.value.length) * 100
})

const rank = computed(() => {
  const s = score.value
  if (s <= 60) return { emoji: '🌱', title: '非遗新苗' }
  if (s <= 80) return { emoji: '⭐', title: '非遗达人' }
  return { emoji: '🏆', title: '农民画专家' }
})

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function startQuiz() {
  // 从总题库随机不重复抽取10题
  const pool = shuffle(quizData as Question[])
  questions.value = pool.slice(0, 10)
  currentIndex.value = 0
  score.value = 0
  correctCount.value = 0
  selectedOption.value = null
  answered.value = false
  finished.value = false
}

function selectOption(index: number) {
  if (answered.value) return
  selectedOption.value = index
  answered.value = true

  if (index === currentQuestion.value!.answer) {
    score.value += 10
    correctCount.value++
  }

  setTimeout(() => {
    nextQuestion()
  }, 1500)
}

function nextQuestion() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    selectedOption.value = null
    answered.value = false
  } else {
    finished.value = true
  }
}

function resetQuiz() {
  startQuiz()
}

startQuiz()
</script>

<template>
  <div class="bg-card rounded-2xl p-6 shadow-sm">
    <!-- 未完成 -->
    <template v-if="!finished">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-display text-xl font-bold text-text">🧠 非遗知识小测验</h3>
        <span class="text-sm text-text-muted">
          {{ score }}分 · 第 {{ currentIndex + 1 }}/{{ questions.length }} 题
        </span>
      </div>

      <!-- 进度条 -->
      <div class="w-full h-2 bg-gray-200 rounded-full mb-6">
        <div
          class="h-full bg-red rounded-full transition-all duration-500"
          :style="{ width: progressPercent + '%' }"
        />
      </div>

      <!-- 题目 -->
      <div class="bg-bg rounded-xl p-5 mb-4">
        <p class="text-sm text-text-muted mb-2">第 {{ currentIndex + 1 }} 题</p>
        <p class="text-lg font-medium text-text" v-if="currentQuestion">
          {{ currentQuestion.question }}
        </p>
      </div>

      <!-- 选项 -->
      <div class="grid grid-cols-1 gap-3">
        <button
          v-for="(opt, idx) in currentQuestion?.options ?? []"
          :key="idx"
          :class="[
            'w-full text-left px-5 py-4 rounded-xl border-2 transition-all',
            !answered
              ? 'border-gray-200 bg-white hover:border-red-light text-text'
              : '',
            answered && idx === currentQuestion?.answer
              ? 'border-green bg-green-light/20 text-text'
              : '',
            answered && idx === selectedOption && idx !== currentQuestion?.answer
              ? 'border-red bg-red-light/20 text-text'
              : '',
            answered && idx !== selectedOption && idx !== currentQuestion?.answer
              ? 'opacity-60 border-gray-200 bg-white text-text'
              : '',
          ]"
          :disabled="answered"
          @click="selectOption(idx)"
        >
          <span class="flex items-center gap-3">
            <span
              :class="[
                'w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium',
                !answered
                  ? 'bg-gray-100 text-text-muted'
                  : '',
                answered && idx === currentQuestion?.answer
                  ? 'bg-green text-white'
                  : '',
                answered && idx === selectedOption && idx !== currentQuestion?.answer
                  ? 'bg-red text-white'
                  : '',
                answered && idx !== selectedOption && idx !== currentQuestion?.answer
                  ? 'bg-gray-100 text-text-muted'
                  : '',
              ]"
            >
              <span v-if="answered && idx === currentQuestion?.answer">✓</span>
              <span v-else-if="answered && idx === selectedOption && idx !== currentQuestion?.answer">✗</span>
              <span v-else>{{ ['A', 'B', 'C', 'D'][idx] }}</span>
            </span>
            <span>{{ opt }}</span>
          </span>
        </button>
      </div>

      <!-- 解释 -->
      <div
        v-if="answered && currentQuestion"
        class="mt-3 px-4 py-2 bg-yellow-light/20 rounded-lg text-sm text-text"
      >
        {{ currentQuestion.explanation }}
      </div>
    </template>

    <!-- 完成 -->
    <div v-else class="text-center py-8">
      <div class="text-6xl mb-4">{{ rank.emoji }}</div>
      <h3 class="font-display text-2xl font-bold text-text mb-2">{{ rank.title }}</h3>
      <p class="text-4xl font-bold text-red mb-2">{{ score }} 分</p>
      <p class="text-text-muted mb-6">
        答对 {{ correctCount }}/{{ questions.length }} 题
      </p>
      <button
        class="px-6 py-3 rounded-full bg-red text-white text-lg font-medium hover:bg-red-light transition-colors"
        @click="resetQuiz"
      >
        再来一次
      </button>
    </div>
  </div>
</template>
