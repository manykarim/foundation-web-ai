<template>
    <Dialog :open="isOpen" :initialFocus="fullDescriptionRef" class="relative z-50" @close="setIsOpen">
        <div class="fixed inset-0 p-4 flex w-screen items-center justify-center bg-background/60 dark:bg-black/60 backdrop-blur">
            <transition appear name="fade">
              <DialogPanel class="w-full md:max-w-screen-lg h-auto max-h-[80%] overflow-auto bg-gray-200 dark:bg-robot-900 flex flex-wrap shadow-lg shadow-black">
                <transition appear name="fade">
                  <button 
                    class="absolute top-6 right-6 p-2 rounded-full border-transparent border-solid bg-white/20 hover:bg-white/30 hover:border-robot-900 transition-all"
                    type="button"
                    @click="setIsOpen(false); $emit('close')">
                    <LucideX class="w-6 h-6 text-white" />
                  </button>
                </transition>
                <ProviderCard class="w-full md:w-96 bg-gray-100 dark:bg-robot-800" :provider="provider" :standalone="false" />
                <div class="w-1/2 grow md:overflow-auto">
                  <DialogTitle class="text-2xl p-8 pb-4 dark:text-white">Course Description</DialogTitle>
                  <!-- eslint-disable vue/no-v-html -->
                  <div
                    ref="fullDescriptionRef"
                    class="pb-16 px-8 body"
                    v-html="renderMarkdown(provider.fullDescription)"
                  />
                </div>
                <!--  -->
              </DialogPanel>
            </transition>
        </div>
    </Dialog>
  </template>
  
  <script setup lang="ts">
import { ref } from 'vue'
import {
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/vue'
import type { Provider } from '~/types/provider';
import { renderMarkdown } from '~/utils/render'
import ProviderCard from './ProviderCard.vue';
import { LucideX } from 'lucide-vue-next'

defineProps<{
    provider: Provider
}>()

const isOpen = ref(true)
const fullDescriptionRef = ref(null)

function setIsOpen(value) {
    isOpen.value = value
}
</script>

<style scoped lang="scss">
button {
  transition-delay: 0.3s;
}
.body {
  font-size: 0.85rem;
  @apply dark:text-white;

  h2 {
    @apply dark:text-white;
  }

  :deep(h2) {
    font-size: 1rem;
    margin-block: 2rem;
  }
  :deep(h3) {
    margin-top: 1.5rem;
    font-family: var(--font-mono);
    font-variation-settings: 'wght' 800;
  }

  :deep(ul) {
    margin-top: 1rem;

    li {
      list-style: circle;
      list-style-position: inside;
    }
  }
}
</style>
