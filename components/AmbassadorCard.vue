<template>
    <div class="">
      <div class="overflow-hidden bg-white dark:bg-robot-900" :class="standalone ? 'shadow-sm shadow-black' : 'h-full pt-8 pb-8'">
        <div class="px-8" :class="standalone ? 'py-8' : 'py-0'">
          <div class="flex gap-2">
            <img
              v-if="ambassador.picture"
              :src="ambassador.picture"
              :alt="ambassador.name"
              class="object-contain rounded-[50%] aspect-square"
              :class="standalone ? 'h-24 mr-4' : 'h-32'">
            <button
              v-if="standalone"
              class="block h-fit"
              @click="showDetails = true">
              <h3 class="m-0 text-start flex text-2xl font-bold font-mono basis-full underline-offset-4 text-robot-600 dark:text-robot-400 underline dark:decoration-robot-200">
                {{ ambassador.name }}
              </h3>
            </button>
            <div v-else class="flex flex-wrap grow items-center md:items-start">
              <div class="sm:visible md:hidden">
                <h2 class="text-start text-2xl font-bold font-mono my-0">
                  {{ ambassador.name }}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <p v-if="ambassador.shortDescription" class="text-sm px-8 pb-4">
          {{ ambassador.shortDescription }}
        </p>

        <div
          v-if="ambassador.location && !standalone"
          class="flex items-center px-8">
          <MapPin class="w-6 h-6 mr-2 shrink-0" />
          <span>{{ ambassador.location.map(capitalize).join(", ") }}</span>
        </div>

        <div
          v-if="ambassador.language && !standalone"
          class="flex items-center my-3 px-8">
          <SpeechIcon class="w-6 h-6 mr-2 shrink-0" />
          <span>{{ ambassador.language.map(capitalize).join(", ") }}</span>
        </div>

        <div
          v-if="ambassador.roles?.length && standalone"
          class="px-8">
          <div class="flex flex-wrap gap-1 mb-4 justify-between">
            <button
              v-for="(role, i) in ambassador.roles"
              :key="i"
              class="badge grow bg-robot-700 text-robot-50">
                {{ role }}
            </button>
          </div>
        </div>
        <div v-if="!standalone" class="flex gap-4 md:justify-start px-8">
          <a
            v-if="ambassador.slackName"
            :href="`https://robotframework.slack.com/team/${ambassador.slackName}`"
            title="Open slack profile"
            aria-label="Open slack profile">
            <button class="secondary flex align-middle gap-1 !px-2">
              <SlackIcon class="w-6 h-6 mr-1 shrink-0 block" aria-hidden="true" />
              <div class="font-sans text-sm">
                {{ ambassador.name.split(' ')[0] }} @ Slack
              </div>
            </button>
          </a>
        </div>

      </div>

      <AmbassadorDetails
        v-if="showDetails && standalone"
        :key="ambassador.name"
        :ambassador="ambassador"
        @close="showDetails = false"
      />
    </div>
  </template>

  <script setup lang="ts">
  import { ref } from 'vue'
  import AmbassadorDetails from './AmbassadorDetails.vue'
  import type { Ambassador } from '~/types/ambassador'
  import { MapPin, SpeechIcon, SlackIcon } from 'lucide-vue-next'

  defineProps<{
    ambassador: Ambassador,
    standalone?: boolean
  }>()

  const showDetails = ref(false)

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  </script>
