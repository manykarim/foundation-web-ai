<template>
  <div id="page" :data-theme="contentPage?.domain" class="grow">
    <ContentNav
      v-if="contentPage?.navbar"
      :title="contentPage.navbar.title"
      :links="contentPage.navbar.links"
    />
    <ContentRenderer :value="contentPage" class="content-renderer" />
    <PageFooter v-if="contentPage?.showFooter !== false" />
  </div>
</template>

<script setup lang="ts">
const contentPage = await queryCollection('content').path('/').first()

if (!contentPage) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}

useSeoMeta({
  title: contentPage.metaTitle ?? contentPage.title,
  description: contentPage.metaDescription
})
</script>

<style scoped>
:deep(.content-renderer) {
  display: contents;
}
</style>
