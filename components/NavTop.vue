<template>
  <nav class="bg-black text-white sticky top-0 p-2 px-4 z-20 border-b-2 border-b-robot-900/10">
    <!-- Logo -->
    <div class="flex justify-between items-center">
      <div>
        <a class="no-underline text-center flex items-center gap-2" href="/">
          <img src="/public/img/rf.svg" class="invert" :width="24" :height="24" alt="Logo">
          <div class="font-ocr w-full text-xl">
            {{ fields.title }}
          </div>
        </a>
      </div>

      <!-- Toggle button mobile -->
      <button class="lg:hidden" @click="toggleNav">
        <MenuIcon v-if="!isOpen" class="w-6 h-6" />
        <XIcon v-else class="w-6 h-6" />
      </button>

      <!-- Desktop items -->
      <div
        v-if="props.fields.links"
        class="hidden lg:block flex-row *:border-x-robot-100 *:border-r-2
          last:*:border-r-0
          *:px-8
          last:*:pr-4
          *:text-center">
        <StyledLink
          v-for="link in props.fields.links"
          :key="link.fields.label"
          :fields="link.fields"
          :inline="true"
          class="font-sans no-underline hover:underline underline-offset-4" />
      </div>
    </div>

    <!-- mobile menu -->
    <div v-if="isOpen" class="absolute z-10 w-full top-full left-0 p-4 bg-black">
      <div class="block pl-8">
        <StyledLink
          v-for="link in props.fields.links"
          :key="link.fields.label"
          :fields="link.fields"
          :inline="false"
          class="my-4 block font-sans no-underline hover:underline underline-offset-4" />
      </div>
    </div>
    <div v-if="isOpen" class="absolute h-[100vh] top-[99%] inset-0 bg-white/50 dark:bg-black/50 z-0" @click="toggleNav" />
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { NavbarEntry } from '~/types/contentful';
import StyledLink from './StyledLink.vue';
import { MenuIcon, XIcon } from 'lucide-vue-next';

const props = defineProps<{
  fields: NavbarEntry['fields']
}>()

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
    0% {
      box-shadow: none;
    }

    100% {
      box-shadow: var(--tw-shadow);
    }
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
