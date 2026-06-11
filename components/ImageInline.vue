<template>
  <fieldset v-if="asset.fields.description">
    <a :href="url" target="_blank">
      <img :src="url">
      <legend class="text-sm">{{ asset.fields.description ?? '' }}</legend>
    </a>
  </fieldset>
  <img
    v-else
    :src="url"
    :class="isSvg ? 'aspect-square' : ''">
</template>  
  
  <script setup lang="ts">
  import type { ImageFile } from '~/types/contentful';

  const props = defineProps<{
    asset: ImageFile
  }>()

  const isSvg = props.asset.fields.file.contentType === "image/svg+xml"
  const url = (props.asset.fields.file.url + '?w=1024&h=1024').replace('downloads.', 'images.')
  </script>

<style scoped>
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>