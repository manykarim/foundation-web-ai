<template>
  <section class="my-16 px-4" :class="width">
    <h2
      v-if="title"
      :id="title.replaceAll(' ', '-').toLowerCase()"
      class="uppercase"
      :class="[fullWidth && 'text-center mb-16', stickyTitle && 'sticky-title']">
      {{ title }}
    </h2>
    <div>
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  fullWidth?: boolean
  stickyTitle?: boolean
  width?: 'narrow' | 'default' | 'wide' | 'full'
}>(), {
  width: 'default'
})
</script>

<style scoped>
section {
  @apply w-full mx-auto;
}
section.narrow { @apply max-w-[1024px]; }
section.default { @apply max-w-[1280px]; }
section.wide { @apply max-w-[1400px]; }

h2 {
  scroll-margin-top: 3rem;
}
h2.sticky-title {
  position: sticky;
  top: 44px;
  z-index: 10;
  @apply bg-background dark:bg-background-darkmode py-2;
}
</style>
