<template>
  <a
    :href="href"
    :class="[
      buttonStyle,
      inline ? 'inline-block mx-2' : 'block w-fit',
      centered ? 'block mx-auto' : ''
    ]"
    :target="external ? '_blank' : '_self'"
    :rel="external ? 'noopener noreferrer' : ''">
    <span>{{ label }}</span>
    <div v-if="sublabel" class="text-xs">{{ sublabel }}</div>
  </a>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  href: string
  buttonStyle?: 'primary' | 'secondary' | 'tertiary' | 'unstyled' | 'ticket'
  external?: boolean
  inline?: boolean
  centered?: boolean
  sublabel?: string
}>()
</script>
