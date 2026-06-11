<template>
  <div
    class="cardContainer px-2"
    :style="computedStyle">
    <div
      class="card"
      :class="[computedClass, props.fields.styling]">
      <RichTextRenderer
        v-if="fields.content"
        :document="fields.content"
        :node-renderers="renderNode()"
        :mark-renderers="renderMarks" />
      <slot />
      <ClientOnly v-if="props.fields.styling === 'stroke'">
        <svg
          class="card__stroke"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          style="filter: blur(4px)">
          <defs>
            <linearGradient :id="gradId" x1="130%" y1="30%" x2="30%" y2="130%">
              <stop offset="0%"   :style="{ stopColor: 'var(--g1)' }" />
              <stop offset="33%"  :style="{ stopColor: 'var(--g2)' }" />
              <stop offset="66%"  :style="{ stopColor: 'var(--g3)' }" />
              <stop offset="100%"  :style="{ stopColor: 'var(--g4)' }" />
            </linearGradient>
          </defs>
          <rect
            :x="inset * 2"
            :y="inset * 2"
            :width="100 - inset * 4"
            :height="100 - inset * 4"
            :rx="'4px'"
            :ry="'4px'"
            fill="none"
            :stroke="`url(#${gradId})`"
            :stroke-width="sw"
            stroke-linejoin="round"
            stroke-linecap="round"
            vector-effect="non-scaling-stroke"
          />
        </svg>
        <svg
          class="card__stroke"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true">
          <defs>
            <linearGradient :id="gradId" x1="130%" y1="30%" x2="30%" y2="130%">
              <stop offset="0%"   :style="{ stopColor: 'var(--g1)' }" />
              <stop offset="33%"  :style="{ stopColor: 'var(--g2)' }" />
              <stop offset="66%"  :style="{ stopColor: 'var(--g3)' }" />
              <stop offset="100%"  :style="{ stopColor: 'var(--g4)' }" />
            </linearGradient>
          </defs>
          <rect
            :x="inset * 2"
            :y="inset * 2"
            :width="100 - inset * 4"
            :height="100 - inset * 4"
            :rx="'4px'"
            :ry="'4px'"
            fill="none"
            :stroke="`url(#${gradId})`"
            :stroke-width="sw"
            stroke-linejoin="round"
            stroke-linecap="round"
            vector-effect="non-scaling-stroke"
          />
        </svg>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CardFields } from '~/types/contentful'
import RichTextRenderer from 'contentful-rich-text-vue-renderer'
import { renderNode, renderMarks } from '~/utils/render'

const props = defineProps<{
  fields: CardFields;
  width?: number;
  widthMobile?: number;
}>()

const computedClass = computed(() => {
  const classes = []
  if (props.fields.centered) classes.push('centered text-center')
  return classes.join(' ')
})

const computedStyle = computed(() => {
  const styles = []
  if (props.width) styles.push(`--w-lg: ${props.width}%`)
  if (props.widthMobile) styles.push(`--w-sm: ${props.widthMobile}%`)
  if (props.fields.maxWidth) styles.push(`--w-lg: ${props.fields.maxWidth}%`)
  if (props.fields.maxWidthMobile) styles.push(`--w-sm: ${props.fields.maxWidthMobile}%`)
  if (props.fields.gap) styles.push(`${props.fields.gap}rem`)

  // interpolated
  if (props.widthMobile && props.width) styles.push(`--w-md: ${(props.widthMobile + props.width) / 2}%`)
  if (props.fields.maxWidth && props.fields.maxWidthMobile) styles.push(`--w-md: ${(props.fields.maxWidthMobile + props.fields.maxWidth) / 2}%`)
  return styles
})

// SVG border config
const sw = 4 // stroke width in px
const inset = sw / 4 // keep stroke inside

// unique gradient id to avoid DOM collisions
const gradId = `card-grad-${Math.random().toString(36).slice(2, 9)}`
</script>

<style scoped>
.cardContainer {
  position: relative;
}

.cardContainer { flex: 0 0 var(--w-lg); }
@media screen and (max-width: 1200px) {
  .cardContainer { flex: 0 0 var(--w-md); }
}
@media screen and (max-width: 768px) {
  .cardContainer { flex: 0 0 var(--w-sm); }
}

.card {
  height: 100%;
  position: relative;
  padding: 1rem;
  border-radius: var(--r, 12px);
}

.card.default {
  @apply bg-white dark:bg-robot-900;
}

.card.small, .card.small > p {
  @apply !text-sm;
}

.card.small {
  padding: 1rem;
}

.card.centered {
  justify-content: center;
  text-align: center;
}

.card__stroke {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
.card > :not(.card__stroke) {
  position: relative;
  z-index: 1;
}
.card.unstyled {
  padding: 0;
}
</style>
