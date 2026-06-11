<template>
  <ClientOnly>
    <div v-if="isAuthenticated">
      <RichTextRenderer :document="fields.authenticatedBody" :node-renderers="renderNode()" :mark-renderers="renderMarks" />
    </div>
    <div v-else-if="fields.unauthenticatedBody">
      <RichTextRenderer :document="fields.unauthenticatedBody" :node-renderers="renderNode()" :mark-renderers="renderMarks" />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import RichTextRenderer from 'contentful-rich-text-vue-renderer'
import type { AuthGateFields } from '~/types/contentful'
import { renderNode, renderMarks } from '~/utils/render'

const props = defineProps<{
  fields: AuthGateFields
}>()

const { isAuthenticated } = useAuth()
</script>
