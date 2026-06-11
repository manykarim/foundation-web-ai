<template>
  <PretalxEmbed :fields="computedFields" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PretalxEmbed from '~/components/PretalxEmbed.vue'

const props = defineProps<{
  pretalxEventId: string
  scheduleUrl?: string
  minified?: boolean
  useHelsinkiTime?: boolean
  hideTime?: boolean
  hasLiveStream?: boolean
}>()

const computedFields = computed(() => ({
  pretalxEventId: props.pretalxEventId,
  scheduleUrl: props.scheduleUrl || '',
  minified: props.minified || false,
  useHelsinkiTime: props.useHelsinkiTime || false,
  hideTime: props.hideTime || false,
  hasLiveStream: props.hasLiveStream || false,
}))
</script>
