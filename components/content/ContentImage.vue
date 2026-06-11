<template>
  <figure class="my-4" :class="centered && 'text-center'">
    <img
      :src="src"
      :alt="alt || ''"
      :width="width"
      :height="height"
      class="inline-block max-w-full h-auto"
    />
    <figcaption v-if="caption" class="text-sm text-gray-500 mt-2">
      {{ caption }}
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
defineProps<{
  src: string
  alt?: string
  width?: number
  height?: number
  caption?: string
  centered?: boolean
}>()
</script>
