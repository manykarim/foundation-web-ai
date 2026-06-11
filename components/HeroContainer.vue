<!-- eslint-disable vue/no-v-html -->
<template>
  <section
    class="hero relative overflow-hidden"
    :class="[
      fields.style === 'default' && 'from-background dark:from-black to-robot-500 dark:to-robot-600',
      fields.style === 'robocon' && 'from-robot-700 to-background-darkmode'
    ]"
    :style="fields.backgroundImage ? { backgroundImage: `url(${fields.backgroundImage.fields.file.url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}">
    <HeroBanner :fields="fields" />
  </section>
</template>

<script setup lang="ts">
import type { HeroBannerFields } from '~/types/contentful'

defineProps<{
  fields: HeroBannerFields
}>()
</script>

<style scoped>
@media screen and (max-width: 768px) {
  .hero {
    :deep(br) {
      display: none;
    }
  }
}
h1 {
  @apply !leading-tight;
  &.small {
    @apply text-3xl md:text-5xl lg:text-6xl xl:text-6xl;
  }  
  &.default {
    @apply text-[12.5vw] md:text-7xl lg:text-8xl xl:text-8xl;
  }
  &.big {
    @apply text-[12.5vw] md:text-5xl lg:text-6xl xl:text-7xl;
  }  
  &.huge {
    @apply text-[30vw] leading-[28vw] md:text-8xl lg:text-9xl xl:text-9xl;
  }  
}
</style>