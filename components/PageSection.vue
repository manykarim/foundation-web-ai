<template>
  <section class="my-16 px-4" :class="fields.width">
    <div v-if="fields.stickyTitle" ref="sentinel" aria-hidden="true" />
    <h2
      v-if="fields.title"
      ref="heading"
      :id="fields.title.replaceAll(' ', '-').toLowerCase()"
      class="uppercase"
      :class="[
        fields.fullWidth && 'text-center mb-16',
        useSticky && 'sticky'
      ]">
      {{ fields.title }}
    </h2>

    <div>
      <RichTextRenderer
        :document="fields.content"
        :node-renderers="renderNode()"
        :mark-renderers="renderMarks"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import RichTextRenderer from 'contentful-rich-text-vue-renderer'
import type { PageSectionFields } from '~/types/contentful'
import { renderNode, renderMarks } from '~/utils/render'

const props = defineProps<{ fields: PageSectionFields }>()

const heading = ref<HTMLElement | null>(null)
const sentinel = ref<HTMLElement | null>(null)
// const isStuck = ref(false)
const useSticky = ref(false)

onMounted(() => {
  if (props.fields.stickyTitle) {
    useSticky.value = window.innerWidth > 1400

    window.addEventListener('resize', () => {
      useSticky.value = window.innerWidth > 1400
    })
  }
})

// onMounted(() => {
//   if (!props.fields.stickyTitle || !heading.value || !sentinel.value) return

//   const topPx = parseFloat(getComputedStyle(heading.value).top || '48') || 48
//   sentinel.value.style.height = '1px'
//   sentinel.value.style.marginTop = `-${topPx}px`

//   const io = new IntersectionObserver(
//     ([entry]) => {
//       isStuck.value = !entry.isIntersecting
//     },
//     {
//       rootMargin: `-${topPx}px 0px 0px 0px`,
//       threshold: 0,
//     }
//   )

//   io.observe(sentinel.value)
//   onBeforeUnmount(() => io.disconnect())
// })
</script>

<style scoped>
section {
  @apply w-full mx-auto;
}
section.narrow { @apply max-w-[1024px]; }
section.default { @apply max-w-[1280px]; }
section.wide { @apply max-w-[1400px]; }

h2 {
  scroll-margin-top: 3rem;
}

.sticky {
  position: sticky;
  top: 5rem;
  z-index: 2;
  display: block;
  width: fit-content;
  animation: scaleOnScroll;
  animation-fill-mode: both;
  animation-timeline: --section;
  animation-range: entry calc(100vh - 20rem) entry calc(100vh + 20rem);
}

/* --- Scroll animation --- */
section {
  view-timeline-name: --section;
  view-timeline-axis: block;
}

@keyframes scaleOnScroll {
  0% {
    transform: translate(0, 0.25rem);
  }
  37% {
    transform: translate(calc(-100% - 0.75rem), 0.25rem);
  }
  /* 68% {
    transform: translate(calc(-100% - 0.75rem), -0.75rem);
  } */
  52% {
    transform: translate(calc(-100% - 0.75rem), -1rem);
  }
  100% {
    transform: translate(calc(-100% - 0.75rem), -2rem);
  }
}
</style>
