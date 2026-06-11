<template>
  <div>

    <div class="flex flex-wrap items-center my-4">
        <div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
          <input v-model="filterString" type="text" placeholder="Find" class="primary w-full">
        </div>
    </div>

    <!-- Ambassador List -->
    <div
      v-if="filteredAmbassadors?.length"
      class="flex flex-wrap md:flex-nowrap mx-auto">

      <!-- left column -->
      <div class="sm:w-full md:w-1/2 md:pr-4 gap-8 flex flex-col">
        <AmbassadorCard
          v-for="ambassador in filteredAmbassadors.filter((_, i) => !(i % 2))"
          :key="ambassador.name"
          :ambassador="ambassador"
          :standalone="true" />
      </div>

      <!-- right column -->
      <div class="sm:w-full md:w-1/2 md:pl-4 gap-8 flex flex-col">
        <AmbassadorCard
          v-for="ambassador in filteredAmbassadors.filter((_, i) => i % 2)"
          :key="ambassador.name"
          :ambassador="ambassador"
          :standalone="true" />
      </div>

    </div>
    <div v-else class="text-center text-xl text-gray-400 my-40">
      No ambassadors found at this time.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Ambassador } from '~/types/ambassador'

const { data: rawAmbassadors } = await useAsyncData('ambassadors-list', () => queryCollection('ambassadors').all())

const ambassadors = computed<Ambassador[]>(() =>
  (rawAmbassadors.value ?? []).map(a => ({
    name: a.name,
    picture: a.picture,
    shortDescription: a.shortDescription,
    longDescription: a.longDescription,
    location: a.location,
    language: a.language,
    slackName: a.slackName,
    roles: a.roles,
  }))
)

const filterString = ref<string>('')

const filteredAmbassadors = computed(() => {
  return ambassadors.value?.filter((ambassador) => {
    const str = filterString.value.toLowerCase().trim()
    if (!str) return true
    const haystack = [
      ambassador.name,
      ambassador.shortDescription,
      ambassador.longDescription,
      ambassador.language?.join(' '),
      ambassador.location?.join(' '),
      ambassador.roles?.join(' '),
    ].filter(Boolean).join(' ').toLowerCase()
    return haystack.includes(str)
  })
})
</script>
