<!-- eslint-disable vue/no-v-html -->
<template>
  <section
    class="hero bg-gradient-to-b"
    :class="[
      fields.style === 'default' && 'from-background dark:from-black to-robot-500 dark:to-robot-600',
      fields.style === 'robocon' && 'from-robot-700 to-background-darkmode',
      fields.centerTitle ? 'text-center' : '',
      'py-16'
    ]"
    :style="fields.backgroundImage ? { backgroundImage: `url(${fields.backgroundImage.fields.file.url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}">
    <div class="w-full max-w-[1280px] mx-auto md:items-center px-4">
      <div
        v-if="fields.eyebrow"
        class="eyebrow font-ocr tracking-widest pl-1"
        v-html="fields.eyebrow" />

      <h1
        class="hero-title uppercase tracking-tighter"
        v-html="renderMarkdown(fields.title, { inline: true })" />

      <div v-if="fields.subtitle" class="hero-subtitle text-xl md:text-2xl">
        <div v-html="renderMarkdown(fields.subtitle, { inline: true })" />
      </div>

      <div v-if="fields.buttons" class="mt-8 flex gap-2 justify-center mb-8">
        <StyledLink v-for="button in fields.buttons" :key="button.fields.label" :fields="button.fields" :inline="false" />
      </div>

      <!-- <div v-if="nextTalkId">
        <StyledLink :fields="{href: `#${nextTalkId}`, label: 'Up next', style: 'ticket', type: 'external'}" :inline="false" target="self" />
      </div> -->
    </div>

    <ClientOnly>
      <div v-if="fields.backgroundImage" class="fx-container">
        <svg
          viewBox="0 0 1600 512"
          class="aurora"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <circle
            v-for="(star, i) in stars"
            :key="i"
            :cx="star.x"
            :cy="star.y"
            :r="star.r"
            class="star"
            :style="{ animationDelay: `${star.delay}s` }"
          />
        </svg>
      </div>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { isAfter } from 'date-fns';
import type { HeroBannerFields } from '~/types/contentful'
import { renderMarkdown } from '~/utils/render'

defineProps<{
  fields: HeroBannerFields
}>()

const nextTalkId = ref('')

onMounted(() => {
  const talks: Element[] = document.querySelectorAll('[id^="talk-"]')
  const dates = []
  for (let i = 0; i < talks.length; i++) {
    dates.push(new Date((talks[i].id.split('talk-')[1])))
  }
  const next = dates
    .sort((a, b) => a < b ? -1 : 1)
    .filter((d) => isAfter(d, new Date()))[0]
  if (next) nextTalkId.value = `talk-${next.toISOString().replace('00.000Z', '00Z')}`
})

const stars = ref(
  Array.from({ length: 30 }).map(() => ({
    x: Math.random() * 1600,
    y: Math.random() * 300,
    r: Math.random() * 1.5 + 0.5,
    delay: Math.random() * 5,
  }))
)
</script>

<style scoped>
@media screen and (max-width: 768px) {
  .hero {
    :deep(br) {
      display: none;
    }
  }
}

.eyebrow {
  @apply text-xs md:text-base;
}

.hero-title {
  @apply !leading-none;
  font-size: min(8rem, 13vw);
  line-height: 0.9;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.hero-subtitle {
  @apply mt-4;
  white-space: pre-line;
}

.fx-container {
  position: absolute;
  inset: 0;
  z-index: 9;
  pointer-events: none;
}

.star {
  fill: white;
  opacity: 0.8;
  animation: twinkle 2s infinite ease-in-out alternate;
  transform-origin: 50% 50%;
}

@keyframes twinkle {
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.9;
  }
}
</style>