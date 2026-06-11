<template>
  <nav class="bg-black text-white sticky top-0 p-2 px-4 z-20 border-b-2 border-b-robot-900/10">
    <div class="flex justify-between items-center">
      <div>
        <a class="no-underline text-center flex items-center gap-2" :href="baseURL">
          <img :src="rfLogo" class="invert" :width="24" :height="24" alt="Logo">
          <div class="font-ocr w-full text-xl">
            {{ title }}
          </div>
        </a>
      </div>

      <button class="lg:hidden" @click="toggleNav">
        <MenuIcon v-if="!isOpen" class="w-6 h-6" />
        <XIcon v-else class="w-6 h-6" />
      </button>

      <div
        v-if="links?.length"
        class="hidden lg:block flex-row *:border-x-robot-100 *:border-r-2
          last:*:border-r-0
          *:px-8
          last:*:pr-4
          *:text-center">
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.href"
          :target="link.external ? '_blank' : '_self'"
          class="unstyled inline-block mx-2 font-sans no-underline hover:underline underline-offset-4">
          <span>{{ link.label }}</span>
        </a>
      </div>
    </div>

    <div v-if="isOpen" class="absolute z-10 w-full top-full left-0 p-4 bg-black">
      <div class="block pl-8">
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.href"
          :target="link.external ? '_blank' : '_self'"
          class="my-4 block font-sans no-underline hover:underline underline-offset-4">
          {{ link.label }}
        </a>
      </div>
    </div>
    <div v-if="isOpen" class="absolute h-[100vh] top-[99%] inset-0 bg-white/50 dark:bg-black/50 z-0" @click="toggleNav" />
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MenuIcon, XIcon } from 'lucide-vue-next'
import rfLogo from '~/public/img/rf.svg'

interface NavLink {
  label: string
  href: string
  external?: boolean
}

defineProps<{
  title: string
  links?: NavLink[]
}>()

const baseURL = useRuntimeConfig().app.baseURL || '/'

const isOpen = ref(false)
function toggleNav() {
  isOpen.value = !isOpen.value
}
</script>

<style scoped lang="scss">
nav {
  @apply shadow-lg;
  box-shadow: none;
}

@supports (animation-timeline: view()) {
  @keyframes fadeIn {
    0% { box-shadow: none; }
    100% { box-shadow: var(--tw-shadow); }
  }

  nav {
    border-bottom: none;
    box-shadow: var(--tw-shadow);
    animation: fadeIn 1ms linear both;
    animation-timeline: scroll();
    transition: all 0.3s;
    animation-range-end: 1rem;
  }
}
</style>
