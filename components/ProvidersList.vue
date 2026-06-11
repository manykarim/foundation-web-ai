<template>
  <div class="mt-16">
    <div class="my-4">
      <!-- controls -->
      <div class="flex flex-wrap items-center justify-between gap-y-4">
          <div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-2">
            <input v-model="filterString" type="text" placeholder="Find by text" class="primary w-full">
          </div>

          <div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-2">
            <select v-model="filterCountry" class="primary w-full">
              <option :value="null">All Locations</option>
              <option v-for="country in uniqueCountries" :key="country" :value="country">
                {{ capitalize(country) }}
              </option>
            </select>
          </div>

          <div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-2">
            <select v-model="filterLanguage" class="primary w-full">
            <option :value="null">All Languages</option>
            <option v-for="language in uniqueLanguages" :key="language" :value="language">
              {{ capitalize(language) }}
            </option>
          </select>
          </div>
          
          <div class="flex gap-2 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-2">
            <StyledCheckbox v-model="showInPerson">
              In-person
            </StyledCheckbox>
            <StyledCheckbox v-model="showOnline">
              Online
            </StyledCheckbox>
          </div>
      </div>
    </div>

    <!-- Providers -->
    <div
      v-if="filteredProviders?.length"
      class="flex flex-wrap gap-2">
      <ProviderCard
        v-for="provider in filteredProviders"
        :key="provider.name"
        class="max-w-full my-2 basis-[calc(100%-0.0rem)] md:basis-[calc(50%-0.25rem)] lg:basis-[calc(33.333333%-0.375rem)] xl:basis-[calc(25%-0.375rem)] grow-0"
        :provider="provider"
        :standalone="true" />
    </div>
    <div v-else class="text-center text-xl text-gray-400 my-40">
      No providers found at this time.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProviderCard from './ProviderCard.vue'
import StyledCheckbox from './StyledCheckbox.vue'
import type { Provider } from '~/types/provider'

// Fetch providers from Nuxt Content collection
const { data: providers } = await useAsyncData('providers', () =>
  queryCollection('providers').all()
) as { data: Ref<Provider[] | null> }

// State for filtering and sorting
const filterCountry = ref<string | null>(null)
const filterLanguage = ref<string | null>(null)
const filterString = ref<string>('')
const showInPerson = ref(true)
const showOnline = ref(true)

const uniqueCountries = computed(() =>
  providers.value?.length
    ? Array.from(new Set(providers.value.flatMap(p => p.country ?? []).map(capitalize)))
    : [],
)

const uniqueLanguages = computed(() =>
  providers.value?.length
    ? Array.from(new Set(providers.value.flatMap(p => p.languages ?? []).map(capitalize)))
    : [],
)

const capitalize = (str: string) =>
  str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')

const filteredProviders = computed(() => {
  return providers.value?.filter((provider) => {
    const countries = provider.country?.map(capitalize) ?? []
    const languages = provider.languages?.map(capitalize) ?? []
    const matchesCountry = !filterCountry.value || countries.includes(capitalize(filterCountry.value))
    const matchesLanguage = !filterLanguage.value || languages.includes(capitalize(filterLanguage.value))
    const matchesString = !filterString.value
      || `${provider.name}${provider.description}${provider.website}`
        .trim()
        .toLowerCase()
        .includes(filterString.value.toLowerCase().trim())
    const matchesTrainingType = (
      (showInPerson.value && provider.inPerson)
      || (showOnline.value && provider.online)
    )

    return matchesCountry && matchesLanguage && matchesString && matchesTrainingType
  })
})
</script>

<style scoped>
</style>
