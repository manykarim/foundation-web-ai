<template>
  <div class="justify-between flex-col flex min-h-screen font-sans">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
let url = 'foundation-web-ai.pages.dev'
const env = process.env
if (env.RF_PAGE === 'ai') url = 'ai.robotframework.io'

useHead({
  script: [
    {
      src: 'https://plausible.io/js/script.outbound-links.pageview-props.tagged-events.js',
      defer: true,
      'data-domain': url
    },
    {
      children: `window.plausible = window.plausible || function() {
        (window.plausible.q = window.plausible.q || []).push(arguments)
      }`
    }
  ]
})
</script>
