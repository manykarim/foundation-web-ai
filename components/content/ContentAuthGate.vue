<template>
  <ClientOnly>
    <div v-if="isAuthenticated">
      <slot name="authenticated" />
    </div>
    <div v-else>
      <slot name="unauthenticated" />
      <slot v-if="!$slots.unauthenticated" />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const { isAuthenticated } = useAuth()
</script>
