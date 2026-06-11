<template>
  <Dialog id="page" :open="isOpen" :initialFocus="fullDescriptionRef" class="relative z-50" @close="setIsOpen">
    <div class="fixed inset-0 p-4 flex w-screen items-center justify-center bg-background/60 dark:bg-black/60 backdrop-blur">
      <transition appear name="fade">
        <DialogPanel
          class="w-full md:max-w-screen-lg h-full md:h-[560px] overflow-auto md:overflow-hidden bg-gray-200 dark:bg-robot-900 flex flex-wrap shadow-lg shadow-black">
          <transition appear name="fade">
            <button class="absolute top-6 right-6 p-2 bg-robot-700 text-white hover:bg-white/30" type="button"
              @click="setIsOpen(false); $emit('close')">
              CLOSE
            </button>
          </transition>
          <div class="flex flex-col justify-between bg-white dark:bg-robot-900">
            <AmbassadorCard class="w-full md:w-96 h-full" :ambassador="ambassador" :standalone="false" />
            <div class="px-8 py-4 text-center">
              <a href="mailto:ambassadors@robotframework.org">
                <button class="primary w-full">
                  Contact Ambassadors
                </button>
              </a>
            </div>
          </div>
          <div class="w-1/2 grow md:overflow-auto h-full">
            <DialogTitle class="m-0 text-2xl p-8 pb-4">{{ ambassador.name }}</DialogTitle>
            <!-- eslint-disable vue/no-v-html -->
            <div
              ref="fullDescriptionRef"
              class="px-8 main"
              v-html="renderMarkdown(ambassador.longDescription || '')" />
            <h2 class="px-8 mt-8 mb-4">Roles</h2>
            <div class="px-8 flex flex-wrap gap-4 mb-8">
              <div v-for="(role, i) in ambassador.roles" :key="i" class="card p-4 bg-white dark:bg-robot-800 w-full">
                <div class="flex items-center gap-2 font-semibold">
                  <IconRole class="invert dark:invert-0" />
                  {{ role }}
                </div>
              </div>
            </div>
          </div>
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
import type { Ambassador } from '~/types/ambassador'
import { renderMarkdown } from '~/utils/render'
import AmbassadorCard from './AmbassadorCard.vue'
import IconRole from './img/IconRole.vue'

defineProps<{
  ambassador: Ambassador
}>()

const isOpen = ref<boolean>(true)
const fullDescriptionRef = ref(null)

function setIsOpen(value: boolean) {
  isOpen.value = value
}
</script>

<style scoped lang="scss">
button {
  transition-delay: 0.3s;
}

.body {
  font-size: 0.85rem;

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
