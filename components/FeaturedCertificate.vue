<template>
  <section class="flex flex-wrap bg-gray-100 dark:bg-robot-800 shadow-sm shadow-black">
    <div class="flex flex-wrap items-center p-4 md:p-8 pr-0 bg-gray-200 dark:bg-robot-700">
      <div class="w-1/5 pr-2 md:pr-0 md:w-1/4">
        <CertificateImg />
      </div>
      <div class="flex-1 w-3/4 md:pl-8">
        <div class="hidden md:block text-robot-primary font-ocr md:mt-[-1rem] mb-[0.5rem]">RFCP®</div>
        <h2 class="!text-base md:!text-3xl font-semibold font-ocr !my-0">{{ fields.title }}</h2>
        <p class="hidden md:block text-base leading-6 font-sans mb-8">{{ fields.subtitle }}</p>
      </div>
    </div>
    <p class="p-4 md:hidden font-sans mb-8">{{ fields.subtitle }}</p>
    <div class="p-4 body text-xs md:text-sm md:pl-16">
      <RichTextRenderer :document="fields?.body" :node-renderers="renderNode()" />
    </div>
  </section>
</template>

<script setup lang="ts">
import RichTextRenderer from 'contentful-rich-text-vue-renderer'
import CertificateImg from './img/CertificateImg.vue'
import type { FeaturedProductFields } from '~/types/contentful'

defineProps<{
  fields: FeaturedProductFields
}>()
</script>

<style scoped>
.body {
  :deep(ul) {
    list-style: none !important;
    margin-bottom: 2rem;
    @media screen and (min-width: 768px) {
      margin-left: -2rem;
    }
    li {
      background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMGMwYjUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaXJjbGUtY2hlY2stYmlnIj48cGF0aCBkPSJNMjEuODAxIDEwQTEwIDEwIDAgMSAxIDE3IDMuMzM1Ii8+PHBhdGggZD0ibTkgMTEgMyAzTDIyIDQiLz48L3N2Zz4=);
      background-repeat: no-repeat;
      padding-left: 2rem;
    }
  }
}
</style>
