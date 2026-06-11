<template>
    <details
      class="group"
      :class="stylesClass[fields.style]">
      <summary class="summary flex items-center py-4 px-6 cursor-pointer">
        <span class="font-sans font-semibold dark:font-medium group-open:text-robot-600 dark:group-open:text-gray-50">
          {{ fields.question }}
        </span>
      </summary>
      <div class="px-6 pb-2 transition-opacity duration-500 group-open:opacity-100 opacity-0">
        <RichTextRenderer
          :document="fields.answer"
          :node-renderers="renderNode()"
        />
      </div>
    </details>
  </template>

  <script setup lang="ts">
  import RichTextRenderer from 'contentful-rich-text-vue-renderer'
  // import { Lightbulb } from 'lucide-vue-next'
  import type { EntryQuestion } from '~/types/contentful'

  const stylesClass = {
    AdditionalInfo: 'info',
    FAQ: 'faq'
  }

  defineProps<{
    fields: EntryQuestion['fields']
  }>()
  </script>

  <style scoped lang="scss">
  summary::-webkit-details-marker {
    display: none;
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