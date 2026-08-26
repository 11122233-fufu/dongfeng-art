import { ref } from 'vue'
import type { Ref } from 'vue'

export function useSpeech(): {
  isSpeaking: Ref<boolean>
  speak: (text: string) => void
  stop: () => void
} {
  const isSpeaking = ref(false)

  function speak(text: string): void {
    if (!window.speechSynthesis) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.9

    utterance.onstart = () => {
      isSpeaking.value = true
    }
    utterance.onend = () => {
      isSpeaking.value = false
    }
    utterance.onerror = () => {
      isSpeaking.value = false
    }

    window.speechSynthesis.speak(utterance)
  }

  function stop(): void {
    window.speechSynthesis.cancel()
    isSpeaking.value = false
  }

  return { isSpeaking, speak, stop }
}
