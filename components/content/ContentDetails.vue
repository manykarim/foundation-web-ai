<template>
  <details
    class="group shadow-md hover:shadow-lg transition-shadow duration-200 border-gray-300 dark:border-gray-700 border border-l-4 border-l-robot-700 dark:border-l-robot-700 open:border-l-robot-500 my-4"
    :class="[variant ? stylesClass[variant] : undefined]">
    <summary class="summary flex items-center py-4 px-6 cursor-pointer">
      <span class="font-sans font-semibold dark:font-medium opacity-85 group-open:opacity-100">
        {{ summary }}
      </span>
    </summary>
    <div class="px-6 pb-2 transition-opacity duration-500 group-open:opacity-100 opacity-0">
      <slot />
    </div>
  </details>
</template>

<script setup lang="ts">
const stylesClass: Record<string, string> = {
  AdditionalInfo: 'info',
  FAQ: 'faq'
}

defineProps<{
  summary: string
  variant?: 'FAQ' | 'AdditionalInfo'
}>()
</script>

<style scoped lang="scss">
summary {
  position: relative;
  padding-right: 1.5rem;

  &::after {
    content: '';
    position: absolute;
    right: 1rem;
    top: 50%;
    width: 0.5rem;
    height: 0.5rem;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    transform: translateY(-50%) rotate(45deg);
    transition: transform 0.2s ease;
  }
}

details[open] summary::after {
  transform: translateY(-50%) rotate(-135deg);
}

details {
  &.info {
    color: var(--color-robot);
  }
  &.faq {
    color: var(--color-robot);
  }
}
</style>
