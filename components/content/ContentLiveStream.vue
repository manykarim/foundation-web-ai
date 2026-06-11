<template>
  <LiveStream :fields="computedFields" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LiveStream from '~/components/LiveStream.vue'

const props = defineProps<{
  dayOneName: string
  dayOneLiveStreamId: string
  dayOneStart: string
  dayOneEnd: string
  dayOneQaUrl?: string
  dayTwoName?: string
  dayTwoLiveStreamId?: string
  dayTwoStart?: string
  dayTwoEnd?: string
  dayTwoQaUrl?: string
  slidoQaUrl?: string
  bodyWidth?: string
}>()

const computedFields = computed(() => ({
  dayOneName: props.dayOneName,
  dayOneLiveStreamId: props.dayOneLiveStreamId,
  dayOneStart: props.dayOneStart,
  dayOneEnd: props.dayOneEnd,
  dayOneQaUrl: props.dayOneQaUrl || '',
  dayTwoName: props.dayTwoName || '',
  dayTwoLiveStreamId: props.dayTwoLiveStreamId || '',
  dayTwoStart: props.dayTwoStart || '',
  dayTwoEnd: props.dayTwoEnd || '',
  dayTwoQaUrl: props.dayTwoQaUrl || '',
  slidoQaUrl: props.slidoQaUrl || '',
  body: null,
  bodyWidth: props.bodyWidth || 'default',
}))
</script>
