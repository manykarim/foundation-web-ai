<template>
  <div
    :class="[containerClasses]"
    class="item-row">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  listType?: 'row' | 'wrapping' | 'scrolling'
  centered?: boolean
  verticallyCentered?: boolean
  sameHeight?: boolean
}>()

const containerClasses = computed(() => {
  let classes = 'flex align-middle my-8 mx-[-0.5rem]'
  if (props.listType === 'wrapping') classes += ' wrapping'
  if (props.listType === 'scrolling') classes += ' scroll'
  if (props.centered) classes += ' justify-center'
  if (props.verticallyCentered) classes += ' items-center'
  return classes
})
</script>
