<template>
  <div class="cardContainer" :class="{ 'has-auto-width': !props.maxWidth }" :style="computedStyle">
    <div class="card" :class="[centered && 'centered text-center', styling]">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  styling?: 'default' | 'stroke' | 'small' | 'unstyled'
  centered?: boolean
  maxWidth?: number | string
  maxWidthMobile?: number | string
  gap?: number | string
}>(), {
  styling: 'default'
})

const computedStyle = computed(() => {
  const w = Number(props.maxWidth)
  const wm = Number(props.maxWidthMobile)
  const styles: string[] = []
  if (w) styles.push(`--w-lg: ${w}%`)
  if (wm) styles.push(`--w-sm: ${wm}%`)
  if (w && wm) styles.push(`--w-md: ${(wm + w) / 2}%`)
  const g = Number(props.gap)
  if (g) styles.push(`--card-gap: ${g}rem`)
  return styles.join('; ')
})
</script>

<style scoped>
.cardContainer {
  position: relative;
  padding-left: var(--card-gap, 0.5rem);
  padding-right: var(--card-gap, 0.5rem);
}
.cardContainer { flex: 0 0 var(--w-lg, 100%); }
.cardContainer.has-auto-width { flex: 0 0 var(--w-lg, calc(33.333% - 0.5rem)); }
@media screen and (max-width: 1200px) {
  .cardContainer { flex: 0 0 var(--w-md, 100%); }
  .cardContainer.has-auto-width { flex: 0 0 var(--w-md, calc(50% - 0.5rem)); }
}
@media screen and (max-width: 768px) {
  .cardContainer { flex: 0 0 var(--w-sm, 100%); }
  .cardContainer.has-auto-width { flex: 0 0 var(--w-sm, 100%); }
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
.card.small, .card.small > :deep(p) {
  @apply !text-sm;
}
.card.small {
  padding: 1rem;
}
.card.centered {
  justify-content: center;
  text-align: center;
}
.card.unstyled {
  padding: 0;
}
.card :deep(p > img) {
  @apply aspect-square;
}
.card :deep(p:has(> img:only-child)) {
  margin: 0;
  line-height: 0;
}
</style>
