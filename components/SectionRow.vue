<template>
  <section class="py-8">
    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3">
        <div v-for="item in items" :key="item.sys.id">
          <Card v-if="item.sys.contentType.sys.id === 'card'" :fields="(item.fields as unknown as CardFields)" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Card from '~/components/PageCard.vue'
import type { CardFields, Grid3Fields } from '~/types/contentful'

defineProps<{
  items: Grid3Fields['items']
}>()

</script>
