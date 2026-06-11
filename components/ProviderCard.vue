<template>
  <div class="dark:text-white h-auto">
    <div class="overflow-hidden" :class="standalone ? 'rounded-lg shadow-sm shadow-black' : ''">
      <div class="bg-white p-4">
        <img
          v-if="provider.logo"
          :src="provider.logo"
          :alt="provider.name"
          class="w-36 h-16 object-contain mx-auto">
      </div>
      <div class="bg-gray-100 dark:bg-robot-800 rounded-b-lg p-8 h-full">
        <a :href="provider.website" target="_blank" rel="noopener noreferrer" class="underline-offset-4 decoration-robot-600 dark:decoration-robot-200">
          <h3 class="text-lg font-bold font-sans normal-case">
            {{ provider.name }}
          </h3>
        </a>
  
        <!-- Description -->
        <p v-if="provider.description" class="text-sm min-h-36">
          {{ provider.description }}
        </p>
  
        <!-- Location + Language Icons -->
        <div class="border-y-2 border-y-robot-700 text-sm text-robot-800 dark:text-white">
          <div
            v-if="provider.country?.length"
            class="flex items-center my-3"
          >
            <MapPin class="w-6 h-6 mr-2 shrink-0" />
            <span>{{ provider.country.join(", ") }}</span>
          </div>
          <div
            v-if="provider.languages?.length"
            class="flex items-center my-3"
          >
            <MessageCircle class="w-6 h-6 mr-2 shrink-0" />
            <span>{{ provider.languages.join(", ") }}</span>
          </div>
          <div
            v-if="provider.online"
            class="flex items-center my-3"
          >
            <Globe class="w-6 h-6 mr-2 shrink-0" />
            <span>Available Online</span>
          </div>
        </div>
        <div v-if="!provider.online" class="h-9" />
  
        <div v-if="standalone" class="flex justify-center gap-4 mt-4">
          <button  v-if="provider.fullDescription" class="primary" @click="showDetails = true">Details</button>
        </div>
        <div v-else-if="provider.website" class="flex justify-center mt-8">
          <a :href="provider.website" target="_blank" rel="noopener noreferrer" class="primary !text-sm text-ellipsis overflow-hidden text-nowrap">
              {{ provider.website.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '') }}
          </a>
        </div>

      </div>

    </div>

    <ProviderDetails
      v-if="showDetails"
      :key="provider.name"
      :provider="provider"
      @close="showDetails = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MapPin, MessageCircle, Globe } from 'lucide-vue-next'
import ProviderDetails from './ProviderDetails.vue'
import type { Provider } from '~/types/provider'

defineProps<{
  provider: Provider,
  standalone?: boolean
}>()

const showDetails = ref(false)

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
</script>
