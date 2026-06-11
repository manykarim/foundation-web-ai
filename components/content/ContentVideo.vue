<template>
  <div class="video-wrapper my-8">
    <iframe
      :src="videoSrc"
      frameborder="0"
      allowfullscreen
      class="w-full aspect-video max-w-[720px] mx-auto"
      :title="title || 'Video'"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  src?: string
  url?: string
  title?: string
}>()

const videoSrc = computed(() => props.src || props.url || '')
</script>
