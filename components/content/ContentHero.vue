<template>
  <section
    class="hero relative overflow-hidden bg-gradient-to-b"
    :class="[
      variant === 'default' && 'from-background dark:from-black to-robot-500 dark:to-robot-600',
      variant === 'robocon' && 'from-robot-700 to-background-darkmode',
      centerTitle ? 'text-center' : '',
      'py-16'
    ]"
    :style="backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}">
    <div class="w-full max-w-[1280px] mx-auto md:items-center px-4">
      <div v-if="eyebrow" class="eyebrow font-ocr tracking-widest pl-1" v-html="eyebrow" />
      <h1
        class="hero-title uppercase tracking-tighter"
        :class="[titleSize]"
        v-html="title" />
      <div v-if="subtitle" class="hero-subtitle text-xl md:text-2xl">
        <div v-html="subtitle" />
      </div>
      <div v-if="$slots.default" class="mt-8 flex gap-2 justify-center mb-8">
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  subtitle?: string
  eyebrow?: string
  variant?: 'default' | 'robocon'
  titleSize?: 'small' | 'default' | 'big' | 'huge'
  backgroundImage?: string
  centerTitle?: boolean
}>(), {
  titleSize: 'default'
})
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
