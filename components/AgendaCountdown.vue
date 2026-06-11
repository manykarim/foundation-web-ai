<template>
  <div class="agenda-countdown flex items-center gap-3 py-2 px-4">
    <span class="text-sm text-robot-300 uppercase tracking-wide">Starts in</span>
    <span v-if="days > 0" class="countdown-value font-ocr tracking-wider text-3xl lg:text-4xl font-bold">
      {{ days }}<span class="countdown-unit text-lg">d</span>
    </span>
    <span v-if="hours > 0 || days > 0" class="countdown-value font-ocr tracking-wider text-3xl lg:text-4xl font-bold">
      {{ hours }}<span class="countdown-unit text-lg">h</span>
    </span>
    <span class="countdown-value font-ocr tracking-wider text-3xl lg:text-4xl font-bold">
      {{ minutes }}<span class="countdown-unit text-lg">m</span>
    </span>
    <span class="countdown-value font-ocr tracking-wider text-3xl lg:text-4xl font-bold">
      {{ seconds.toString().padStart(2, '0') }}<span class="countdown-unit text-lg">s</span>
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  targetTime: string
}>()

const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

function update() {
  const now = new Date()
  const target = new Date(props.targetTime)
  const diff = Math.max(0, target.getTime() - now.getTime())
  const totalSeconds = Math.floor(diff / 1000)
  days.value = Math.floor(totalSeconds / 86400)
  hours.value = Math.floor((totalSeconds % 86400) / 3600)
  minutes.value = Math.floor((totalSeconds % 3600) / 60)
  seconds.value = totalSeconds % 60
}

let interval: ReturnType<typeof setInterval>

onMounted(() => {
  update()
  interval = setInterval(update, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped>
.countdown-value {
  background: linear-gradient(90deg, var(--g1), var(--g2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.countdown-unit {
  background: linear-gradient(90deg, var(--g2), var(--g3));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
