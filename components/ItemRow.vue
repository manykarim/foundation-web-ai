<template>
  <div
    :id="`row-${props.fields.id}`"
    ref="container"
    :class="[containerClasses, props.fields.marginDesktop ? 'lg:gap-x-4' : '']"
    class="item-row">
    <component
      :is="getItemComponent(item)"
      v-for="(item, i) in props.fields.items"
      :key="i" 
      :fields="(item.fields as unknown as CardFields)"
      :width="props.fields.fixedWidth"
      :width-mobile="props.fields.fixedWidthMobile"
      :style="[
        !props.fields.sameHeight && 'height: fit-content'
]" />
  </div>
</template>
  
<script setup lang="ts">
import { computed } from 'vue'
import type { CardEntry, CardFields, ItemRowFields } from '~/types/contentful'
import PageCard from './PageCard.vue'

const props = defineProps<{ fields: ItemRowFields }>()
const container = ref<HTMLElement>()

const getItemComponent = (item: CardEntry | undefined) => {
  if (item?.sys?.contentType.sys.id === 'card') return PageCard
  return undefined
}

// If overflowScroll is true, items are displayed in a horizontal row with scrolling,
// otherwise they wrap.
const containerClasses = computed(() => {
  let classes = 'flex w-[100% - 1rem] align-middle my-8 mx-[-0.5rem]'
  if (props.fields.listType === 'row') classes += ' '
  if (props.fields.listType === 'wrapping') classes += ' wrapping'
  if (props.fields.listType === 'scrolling') classes += ' scroll'
  if (props.fields.centered) classes += ' justify-center'
  if (props.fields.verticallyCentered) classes += ' verticallyCentered'
  return classes
})
</script>

<style lang="scss" scoped>
.verticallyCentered {
  align-items: center;
}
</style>
  