<template>
  <div>
    <Teleport v-if="fields.minified" to="#pinned-talk-target" :disabled="!pinnedTalkTarget">
      <!-- Pinned: current talk -->
      <div
        v-if="anyInstanceActive && currentTalk"
        class="pinned-talk"
      >
        <div v-if="currentTalk.type === 'talk'" class="flex -space-x-2 shrink-0">
          <img
            v-for="speaker in currentTalk.speakers"
            :key="speaker.code"
            :src="speaker.avatar_url ?? '/public/img/question-mark'"
            :title="speaker.name"
            class="pinned-speaker"
          >
        </div>
        <span class="pinned-talk-label">NOW:</span>
        <span class="pinned-talk-title">{{ currentTalk.title }}</span>
        <button class="pinned-talk-btn" @click="scrollToElement(currentTalkElementId)">
          Show in Agenda
        </button>
      </div>
      <!-- Pinned: countdown to next talk -->
      <div
        v-else-if="!anyInstanceActive && nextUpcomingStart && isEarliestUpcoming"
        class="pinned-talk"
      >
        <span class="pinned-talk-label">Next:</span>
        <span class="pinned-talk-title">{{ nextUpcomingTitle }}</span>
        <AgendaCountdown :target-time="nextUpcomingStart" class="pinned-countdown" />
      </div>
    </Teleport>
    <template v-for="(talk, i) in talks" :key="i">
      <AgendaCountdown
        v-if="getItemId(talk) === nextUpcomingId && !anyInstanceActive && isEarliestUpcoming"
        :target-time="nextUpcomingStart"
      />

      <!-- Minified compact row -->
      <div
        v-if="fields.minified"
        :id="getItemId(talk)"
        :class="[
          'minified-row flex items-center gap-x-3 gap-y-1 border-l-4 border-robot-400 mb-2 px-3 cursor-pointer w-full',
          talk.type === 'break' ? 'bg-robot-900' : 'minified-talk-bg',
          getItemId(talk) === currentItemId && 'current-talk',
          isItemPast(talk) && 'past-talk',
          talk.type === 'break' && 'break-item',
          hasLargeGapBefore(i) && 'mt-8'
        ]"
        :style="{
          '--progress': getItemId(talk) === currentItemId ? progress + '%' : undefined,
          '--scale': getMinifiedScale(talk),
        }"
        @click="talk.type === 'talk' && openModal(talk)"
      >
        <div v-if="talk.type === 'talk'" class="flex -space-x-2 shrink-0 w-[52px]" style="min-width: fit-content;">
          <img
            v-for="speaker in talk.speakers"
            :key="speaker.code"
            :src="speaker.avatar_url ?? '/public/img/question-mark'"
            :title="speaker.name"
            class="speaker-mini"
          >
        </div>
        <div v-else class="shrink-0 w-[52px]" />
        <div class="grow min-w-0">
          <div class="text-base lg:text-lg truncate">
            {{ talk.title }}
          </div>
        </div>
        <div class="minified-meta shrink-0 flex items-center gap-2 ml-auto">
          <button
            v-if="talk.type === 'talk' && canWatchLive(talk)"
            class="watch-live shrink-0 text-xs px-2 py-1 inline-flex items-center gap-1"
            @click.stop="watchLive(talk)"
          >
            <IconYoutube class="w-4 h-3 shrink-0" />
            Watch Live
          </button>
          <button
            v-if="talk.type === 'talk' && canWatchReLive(talk)"
            class="watch-relive shrink-0 text-xs px-2 py-1 inline-flex items-center gap-1"
            @click.stop="watchReLive(talk)"
          >
            <IconYoutube class="w-4 h-3 shrink-0" />
            Watch Re-Live
          </button>
          <div v-if="!fields.hideTime" class="time shrink-0 text-xs px-2 py-1 bg-robot-700 whitespace-nowrap">
            {{ formatLocalTime(new Date(talk.type === 'talk' ? talk.slots[0].start : talk.start), props.fields.useHelsinkiTime) }}
            <span v-if="!props.fields.useHelsinkiTime" class="time-extra text-sm">({{ Intl.DateTimeFormat().resolvedOptions().timeZone }})</span>
            <span class="time-extra">{{ getLength(talk) }}</span>
          </div>
          <div
            v-if="talk.type === 'break' && getItemId(talk) === currentItemId && remainingSeconds > 0"
            class="break-countdown font-ocr tracking-wider text-lg font-bold shrink-0"
          >
            {{ formatCountdown(remainingSeconds) }}
          </div>
        </div>
      </div>

      <!-- Full details view (original) -->
      <details
        v-else
        :id="getItemId(talk)"
        :class="[
          'group border-l-4 border-robot-400 bg-robot-50 mb-4 marker:content-none w-full',
          getItemId(talk) === currentItemId && 'current-talk',
          talk.type === 'break' && 'break-item',
          hasLargeGapBefore(i) && 'mt-16'
        ]"
        :style="getItemId(talk) === currentItemId ? { '--progress': progress + '%' } : {}"
      >
        <summary class="cursor-pointer">
          <div class="flex">
            <div class="w-1/6 hidden md:block">
              <template v-if="talk.type === 'talk'">
                <div
                  v-for="(speaker) in talk.speakers"
                  :key="speaker.code"
                  class="">
                  <div class="p-4 pb-0">
                    <img
                      :src="speaker.avatar_url ?? '/public/img/question-mark'"
                      class="speaker shadow-md shadow-robot-800">
                  </div>
                  <div class="text-center my-2">
                    {{ speaker.name }}
                  </div>
                </div>
              </template>
            </div>
            <div class="w-full md:w-5/6 p-4">
              <div class="flex">
                <div class="grow">
                  <div v-if="talk.type === 'talk'" class="arrow mt-4 mx-2 mr-4 shrink-0 float-left" />
                  <div
                    :id="toSlug(talk.title)"
                    class="talk-title text-lg lg:text-2xl text-white">
                    {{ talk.title }}
                  </div>
                </div>
                <a v-if="talk.type === 'talk'" class="block text-lg" :href="`#${toSlug(talk.title)}`">
                  🔗
                </a>
              </div>
              <div class="flex items-center my-2 gap-x-4">
                <div v-if="!fields.hideTime" class="p-2 bg-robot-700">
                  {{ formatLocalTime(new Date(talk.type === 'talk' ? talk.slots[0].start : talk.start), props.fields.useHelsinkiTime) }}
                  <span v-if="!props.fields.useHelsinkiTime" class="text-sm">({{ Intl.DateTimeFormat().resolvedOptions().timeZone }})</span>
                  <span class="text-sm">{{ getLength(talk) }}</span>
                </div>
                <div
                  v-if="talk.type === 'break' && getItemId(talk) === currentItemId && remainingSeconds > 0"
                  class="break-countdown font-ocr tracking-wider text-3xl lg:text-4xl font-bold"
                >
                  {{ formatCountdown(remainingSeconds) }}
                </div>
              </div>
              <div v-if="talk.type === 'talk'" class="md:hidden">
                By {{ talk.speakers.map(({name}) => name).join(', ') }}
              </div>
              <div v-if="talk.type === 'talk'" v-html="renderMarkdown(talk.abstract)" class="text-sm" />
              <span
                v-show="talk.type === 'talk' && hasRecording(talk.code)"
                class="watch-recording inline-flex items-center gap-2 mt-2 px-4 py-1.5 text-lg font-bold uppercase tracking-wide rounded"
              >
                <IconYoutube class="w-6 h-4 shrink-0" />
                Watch Recording
              </span>
              <button
                v-if="talk.type === 'talk' && canWatchLive(talk)"
                class="watch-live inline-flex items-center gap-2 mt-2 px-4 py-1.5 text-lg font-bold uppercase tracking-wide rounded"
                @click.stop="watchLive(talk)"
              >
                <IconYoutube class="w-6 h-4 shrink-0" />
                Watch Live
              </button>
              <button
                v-if="talk.type === 'talk' && canWatchReLive(talk)"
                class="watch-relive inline-flex items-center gap-2 mt-2 px-4 py-1.5 text-lg font-bold uppercase tracking-wide rounded"
                @click.stop="watchReLive(talk)"
              >
                <IconYoutube class="w-6 h-4 shrink-0" />
                Watch Re-Live
              </button>
            </div>
          </div>
        </summary>
        <div v-if="talk.type === 'talk'" class="transition-opacity duration-300 group-open:opacity-100 opacity-0">
          <div class="m-4 p-2 md:p-8 pt-4 border-t-2 border-robot-800 bg-black/20">
            <div v-show="isAuthed && getRecordingUrl(talk.code)" class="mb-6">
              <div class="aspect-video w-full overflow-hidden bg-black/40">
                <iframe
                  v-if="isAuthed && getRecordingUrl(talk.code)"
                  class="w-full h-full"
                  :src="getRecordingUrl(talk.code)"
                  title="Recording"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                />
              </div>
            </div>
            <div
              v-html="renderMarkdown(talk.description)"
              class="" />
            <div v-for="(speaker) in talk.speakers" :key="speaker.code" class="flex bg-black/20">
              <div class="w-1/4 p-2">
                <img
                  :src="speaker.avatar_url ?? '/public/img/question-mark'"
                  class="speaker shadow-md shadow-robot-800">
              </div>
              <div class="w-3/4 p-2 md:p-6 pl-0">
                <div class="text-xl font-semibold mb-3">
                  {{ speaker.name }}
                </div>
                {{ speaker.biography }}
              </div>
            </div>
          </div>
        </div>
    </details>
    </template>

    <!-- Modal for minified talk details -->
    <Dialog :open="!!selectedTalk" class="relative z-50" @close="selectedTalk = null">
      <div class="fixed inset-0 p-4 flex w-screen items-center justify-center bg-black/60 backdrop-blur">
        <transition appear name="fade">
          <DialogPanel
            v-if="selectedTalk"
            class="modal-panel w-full md:max-w-screen-lg max-h-[90vh] overflow-auto border-l-4 border-robot-400 shadow-lg shadow-black rounded"
          >
            <div class="sticky top-0 z-10 flex items-center justify-between p-4 modal-header border-b border-robot-700/50">
              <h3 class="text-lg lg:text-2xl text-white">
                {{ selectedTalk.title }}
              </h3>
              <button
                class="p-2 bg-robot-700 hover:bg-white/30 shrink-0 ml-4"
                type="button"
                @click="selectedTalk = null"
              >
                Close
              </button>
            </div>
            <div class="flex">
              <div class="w-full md:w-5/6 p-4 md:p-8">
                <div class="flex items-center mb-4 gap-x-4">
                  <div v-if="!fields.hideTime" class="p-2 bg-robot-700 text-sm">
                    {{ formatLocalTime(new Date(selectedTalk.slots[0].start), props.fields.useHelsinkiTime) }}
                    <span v-if="!props.fields.useHelsinkiTime" class="text-sm">({{ Intl.DateTimeFormat().resolvedOptions().timeZone }})</span>
                    <span class="text-sm">{{ getLength(selectedTalk) }}</span>
                  </div>
                  <button
                    v-if="canWatchLive(selectedTalk)"
                    class="watch-live inline-flex items-center gap-2 px-4 py-1.5 text-lg font-bold uppercase tracking-wide rounded"
                    @click="watchLive(selectedTalk!); selectedTalk = null"
                  >
                    <IconYoutube class="w-6 h-4 shrink-0" />
                    Watch Live
                  </button>
                  <button
                    v-if="canWatchReLive(selectedTalk)"
                    class="watch-relive inline-flex items-center gap-2 px-4 py-1.5 text-lg font-bold uppercase tracking-wide rounded"
                    @click="watchReLive(selectedTalk); selectedTalk = null"
                  >
                    <IconYoutube class="w-6 h-4 shrink-0" />
                    Watch Re-Live
                  </button>
                </div>
                <div v-show="isAuthed && getRecordingUrl(selectedTalk.code)" class="mb-6">
                  <div class="aspect-video w-full overflow-hidden bg-black/40">
                    <iframe
                      v-if="isAuthed && getRecordingUrl(selectedTalk.code)"
                      class="w-full h-full"
                      :src="getRecordingUrl(selectedTalk.code)"
                      title="Recording"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowfullscreen
                    />
                  </div>
                </div>
                <div v-html="renderMarkdown(selectedTalk.abstract)" class="mb-4" />
                <div class="md:hidden mb-4">
                  By {{ selectedTalk.speakers.map(({name}) => name).join(', ') }}
                </div>
                <div class="m-0 p-2 md:p-8 pt-4 border-t-2 border-robot-800 bg-black/20">
                  <div v-html="renderMarkdown(selectedTalk.description)" class="mb-6" />
                  <div v-for="speaker in selectedTalk.speakers" :key="speaker.code" class="flex bg-black/20 mb-4">
                    <div class="w-1/4 p-2">
                      <img
                        :src="speaker.avatar_url ?? '/public/img/question-mark'"
                        class="speaker small shadow-md shadow-robot-800"
                      >
                    </div>
                    <div class="w-3/4 p-2 md:p-6 pl-0">
                      <div class="text-xl font-semibold mb-3">
                        {{ speaker.name }}
                      </div>
                      {{ speaker.biography }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </transition>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { PretalxEmbedFields, VideoFields } from '~/types/contentful';
import { format, isSameDay, differenceInMinutes, minutesToHours } from 'date-fns';
import { getEntries } from '~/utils/contentfulFetch'
import { Dialog, DialogPanel } from '@headlessui/vue'
import IconYoutube from './img/IconYoutube.vue'

const toSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const localTimeFormatter = new Intl.DateTimeFormat(undefined, {
  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
})
const helsinkiTimeFormatter = new Intl.DateTimeFormat(undefined, {
  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  timeZone: 'Europe/Helsinki',
})
function formatLocalTime(date: Date, helsinki?: boolean) {
  return (helsinki ? helsinkiTimeFormatter : localTimeFormatter).format(date)
}

const instanceId = `pretalx-${Math.random().toString(36).slice(2)}`
const { setActive, setNextUpcoming, setCurrentTalkInfo, clearCurrentTalkInfo, anyInstanceActive, isEarliestUpcoming, currentTalkElementId } = useAgendaState(instanceId)

const isAuthed = ref(false)
const currentItemId = ref('')
const pinnedTalkTarget = ref(false)
const progress = ref(0)
const remainingSeconds = ref(0)
const nextUpcomingId = ref('')
const nextUpcomingStart = ref('')
const nextUpcomingTitle = ref('')
const selectedTalk = ref<TalkWithState | null>(null)

function openModal(talk: TalkWithState) {
  selectedTalk.value = talk
}

function getItemId(item: TalkWithState | Break): string {
  if (item.type === 'talk') return `talk-${item.slots[0].start}`
  return `break-${item.start}`
}

function getItemStart(item: TalkWithState | Break): string {
  return item.type === 'talk' ? item.slots[0].start : item.start
}

function getItemEnd(item: TalkWithState | Break): string {
  return item.type === 'talk' ? item.slots[0].end : item.end
}

function scrollToElement(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const container = scrollContainer?.value
  if (container) {
    const elTop = el.offsetTop - container.offsetTop
    container.scrollTo({ top: elTop - container.clientHeight / 2 + el.clientHeight / 2, behavior: 'smooth' })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

function isElementVisible(id: string): boolean {
  const el = document.getElementById(id)
  if (!el) return false
  const container = scrollContainer?.value
  if (container) {
    const elTop = el.offsetTop - container.offsetTop
    return elTop >= container.scrollTop && elTop < container.scrollTop + container.clientHeight
  }
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight && rect.bottom > 0
}

function updateCurrentTalk() {
  const now = new Date()
  const previousItemId = currentItemId.value
  const current = talks.value.find((t) => {
    const start = new Date(getItemStart(t))
    const end = new Date(getItemEnd(t))
    return now >= start && now < end
  })
  if (current) {
    const newId = getItemId(current)
    if (newId !== previousItemId && previousItemId) {
      if (isElementVisible(previousItemId)) {
        nextTick(() => {
          scrollToElement(newId)
        })
      }
    }
    currentItemId.value = newId
    setActive(true)
    setCurrentTalkInfo(current.title, newId)
    const start = new Date(getItemStart(current)).getTime()
    const end = new Date(getItemEnd(current)).getTime()
    const elapsed = now.getTime() - start
    progress.value = Math.min(100, Math.max(0, (elapsed / (end - start)) * 100))
    remainingSeconds.value = Math.max(0, Math.ceil((end - now.getTime()) / 1000))
  } else {
    currentItemId.value = ''
    setActive(false)
    clearCurrentTalkInfo()
    progress.value = 0
    remainingSeconds.value = 0
    // Find next upcoming item
    const upcoming = talks.value.find((t) => {
      const start = new Date(getItemStart(t))
      return now < start
    })
    if (upcoming) {
      nextUpcomingId.value = getItemId(upcoming)
      nextUpcomingStart.value = getItemStart(upcoming)
      nextUpcomingTitle.value = upcoming.title
      setNextUpcoming(getItemStart(upcoming))
    } else {
      nextUpcomingId.value = ''
      nextUpcomingStart.value = ''
      nextUpcomingTitle.value = ''
      setNextUpcoming(null)
    }
    return
  }
  nextUpcomingId.value = ''
  nextUpcomingStart.value = ''
  nextUpcomingTitle.value = ''
  setNextUpcoming(null)
}

// import { isSameDay, format } from 'date-fns'
// import { renderMarkdown } from '~/utils/render'

const props = defineProps<{
  fields: PretalxEmbedFields
}>()

type Speaker = {
  avatar_url: string;
  biography: string;
  code: string;
  name: string;
  submissions?: unknown[];
  isOpen: boolean;
}

interface Talk {
  type: 'talk';
  code: string;
  title: string;
  abstract: string;
  description: string;
  speakers: Speaker[];
  duration: number;
  slots: {
    id: number;
    room: number;
    start: string;
    end: string;
    duration: number;
    description?: string;
  }[];
}

interface Break {
  type: 'break';
  title: string;
  duration: number;
  start: string;
  end: string;
  submission: null;
  description: {
    en: string;
  }
}

type TalkWithState = Omit<Talk, 'speakers'> & {
  speakers: Speaker[]
}

const hasQuery = props.fields.pretalxEventId.includes('?')

const { data } = await useFetch<{ results: Talk[] }>(`${props.fields.pretalxEventId}${hasQuery ? '&' : '?'}expand=speakers,track,slots`)
const { data: scheduleData } = props.fields.scheduleUrl ? await useFetch<{ slots: (Break | {submission: Talk})[] }>(props.fields.scheduleUrl ?? '') : { data: null }

const talks = ref<(TalkWithState | Break)[]>([])

const currentTalk = computed(() => {
  if (!currentItemId.value) return null
  return talks.value.find(t => getItemId(t) === currentItemId.value) ?? null
})

const {data: {value: videos}} = await useAsyncData('videos-list', () => getEntries<VideoFields>('video'))

function getRecordingUrl(code: string): string | undefined {
  if (!isAuthed.value) return undefined
  const videoCode = videos?.find((v) => v.title === code)?.url
  if (!videoCode) return undefined
  return `https://www.youtube.com/embed/${videoCode}`
}

function hasRecording(code: string): boolean {
  return isAuthed.value && !!getRecordingUrl(code)
}

// Stream support (injected from LiveStream.vue)
const jumpToStreamTime = inject<((talkStart: string, live?: boolean) => void) | null>('jumpToStreamTime', null)
const scrollContainer = inject<Ref<HTMLElement | null> | null>('scrollContainer', null)

function isTalkPast(talk: TalkWithState): boolean {
  return new Date() > new Date(talk.slots[0].end)
}

function isItemPast(item: TalkWithState | Break): boolean {
  return new Date() > new Date(getItemEnd(item))
}

function isCurrentTalk(talk: TalkWithState): boolean {
  return currentItemId.value === getItemId(talk)
}

function canWatchLive(talk: TalkWithState): boolean {
  return !!props.fields.hasLiveStream && isCurrentTalk(talk)
}

function canWatchReLive(talk: TalkWithState): boolean {
  return !!props.fields.hasLiveStream && isTalkPast(talk) && !hasRecording(talk.code)
}

function watchLive(talk: TalkWithState) {
  const start = talk.slots[0].start
  jumpToStreamTime?.(start, true)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function watchReLive(talk: TalkWithState) {
  const start = talk.slots[0].start
  jumpToStreamTime?.(start)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watchEffect(() => {
  if (!data.value?.results) return
  const normalizeNewlines = (s: string) => (s ?? "").replace(/\r\n/g, "\n")

  talks.value = data.value.results
    .map((talk) => ({
      ...talk,
      type: 'talk' as const,
      speakers: talk.speakers.map((s) => ({
        ...s,
        biography: normalizeNewlines(s.biography),
        isOpen: false
      }))
    }))
    .sort(
      (a, b) =>
        new Date(a.slots[0].start).getTime() -
        new Date(b.slots[0].start).getTime()
    )

    if (scheduleData) {
      const breaks = scheduleData.value?.slots
        .filter((slot) => !slot.submission)
        .filter((slot) => data.value?.results
          .some((talk) => isSameDay(new Date(talk.slots[0].start), new Date(slot.start))))
        .map((a) => ({
          ...a,
          type: 'break' as const,
          title: a.description.en
        }))
      if (breaks?.length) {
        talks.value = [...talks.value, ...breaks]
          .sort(
            (a, b) =>
              new Date(a.type === 'talk' ? a.slots[0].start : a.start).getTime() -
              new Date(b.type === 'talk' ? b.slots[0].start : b.start).getTime()
          )
      }
    }
})

let initialScrollDone = false

function scrollToCurrentItem() {
  if (currentItemId.value && !initialScrollDone) {
    initialScrollDone = true
    setTimeout(() => {
      scrollToElement(currentItemId.value)
    }, 1000)
  }
}

onMounted(() => {
  isAuthed.value = !!localStorage.getItem('attendee') && !!localStorage.getItem('authToken')
  pinnedTalkTarget.value = !!document.getElementById('pinned-talk-target')
  updateCurrentTalk()
  scrollToCurrentItem()
  setInterval(updateCurrentTalk, 1000)
})

// Watch for talks being populated (async data) and retry initial scroll
watch(() => talks.value.length, () => {
  if (!initialScrollDone) {
    updateCurrentTalk()
    scrollToCurrentItem()
  }
})

const getHelsinkiTime = (dateStr: string) => {
  const date = new Date(dateStr).toLocaleString("en-US", { timeZone: "Europe/Helsinki" });
  return new Date(date)
}

function formatCountdown(totalSeconds: number): string {
  const min = Math.floor(totalSeconds / 60)
  const sec = totalSeconds % 60
  return `${min}:${sec.toString().padStart(2, '0')}`
}

const getDurationMinutes = (talk: Talk | Break): number => {
  if (talk.type === 'talk') {
    return differenceInMinutes(new Date(talk.slots[0].end), new Date(talk.slots[0].start))
  }
  return differenceInMinutes(new Date(talk.end), new Date(talk.start))
}

const hasLargeGapBefore = (index: number): boolean => {
  if (index === 0) return false
  const prev = talks.value[index - 1]
  const curr = talks.value[index]
  const prevEnd = new Date(getItemEnd(prev))
  const currStart = new Date(getItemStart(curr))
  return differenceInMinutes(currStart, prevEnd) > 120
}

const getMinifiedScale = (talk: Talk | Break): number => {
  const minutes = getDurationMinutes(talk)
  if (minutes <= 15) return 1
  return Math.min(4, minutes / 15)
}

const getLength = (talk: Talk | Break) => {
  const minutes = getDurationMinutes(talk)

  if (minutes < 60) return ` | ${minutes} min`
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) return ` | ${minutesToHours(minutes)} hrs`
  return ` | ${minutesToHours(minutes)} hrs ${minutes % 60} min`
}
</script>

<style scoped lang="scss">
details,
.minified-row {
  scroll-margin-block: 2rem;
  border-radius: 4px;
}
.talk-title {
  scroll-margin-top: 1rem;
}
summary {
  display: block;
}
.arrow {
  width: 0.5rem;
  height: 0.5rem;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: translateY(-50%) rotate(-45deg); // arrow pointing right
  transition: transform 0.2s ease;
}
details[open] {
  .arrow {
    transform: translateY(-50%) rotate(45deg); // arrow pointing right
  }
}
details summary::-webkit-details-marker {
  display: none;
}
img.speaker {
  aspect-ratio: 1;
  width: 90%;
  border-radius: 0.5rem;
  object-fit: cover;
  filter: grayscale(0.7) brightness(0.7);
  transition: filter 0.3s;
  margin: 1rem auto 0.25rem;

  &:hover {
    filter: none;
  }
}
img.speaker.small {
  width: 70%;
}
details:open {
  img.speaker {
    filter: none;
  }
}
details.break-item {
  background: none;
  @apply bg-robot-900;
}
details.current-talk,
.minified-row.current-talk {
  border-left-color: var(--g1);
  border-left-width: 4px;
  border-left-style: solid;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}
details.current-talk::after,
.minified-row.current-talk::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: var(--progress, 0%);
  background: linear-gradient(90deg, var(--g1), var(--g2), var(--g3), var(--g4));
  background-size: 200% 100%;
  animation: shimmer 3s linear infinite;
  transition: width 30s linear;
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.break-countdown {
  background: linear-gradient(90deg, var(--g1), var(--g2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.watch-recording {
  border: 1px solid var(--g2);
  // color: var(--g2);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: var(--g2);
  }
}
details[open] .watch-recording {
  display: none;
}
.watch-live {
  border: 1px solid var(--g1);
  // color: var(--g1);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  &:hover {
    background: var(--g1);
  }
}
details[open] .watch-live {
  display: none;
}
.watch-relive {
  border: 1px solid var(--g3);
  // color: var(--g3);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  &:hover {
    background: var(--g3);
  }
}
details[open] .watch-relive {
  display: none;
}
.speaker-mini {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  filter: grayscale(0.7) brightness(0.7);
  border: 2px solid var(--color-robot-700);
}
.minified-row:hover .speaker-mini {
  filter: none;
}
.minified-row {
  --scale: 1;
  min-height: calc(var(--scale) * 2.5rem);
  padding-top: calc(var(--scale) * 0.25rem);
  padding-bottom: calc(var(--scale) * 0.25rem);
  transition: background 0.15s;
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
}
@media screen and (max-width: 999px) {
  .minified-row:not(.break-item) {
    display: grid;
    grid-template-columns: 52px 1fr;
    grid-template-rows: auto auto;
    align-items: center;
    gap: 0.25rem 0.75rem;
  }
  .minified-row:not(.break-item) .flex.-space-x-2,
  .minified-row:not(.break-item) > .shrink-0.w-\[52px\] {
    grid-row: 1 / -1;
    align-self: center;
    min-width: 0 !important;
    width: 52px;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .minified-row:not(.break-item) .flex.-space-x-2 {
    margin-left: 0;
  }
  .minified-row:not(.break-item) .speaker-mini {
    width: 28px;
    height: 28px;
    margin-left: 0;
  }
  .minified-row:not(.break-item) .grow {
    grid-column: 2;
  }
  .minified-row:not(.break-item) .minified-meta {
    grid-column: 2;
    margin-left: 0;
    justify-content: flex-start;
  }
}
.modal-panel {
  background:
    linear-gradient(
      100deg,
      rgb(from var(--g1) r g b / 0.1),
      rgb(from var(--g2) r g b / 0.1),
      rgb(from var(--g3) r g b / 0.1),
      rgb(from var(--g4) r g b / 0.1)
    ) padding-box,
    linear-gradient(
      -10deg,
      rgb(from var(--g1) r g b / 0.1),
      rgb(from var(--g2) r g b / 0.1),
      rgb(from var(--g3) r g b / 0.1),
      rgb(from var(--g4) r g b / 0.1)
    ) border-box;
  @apply bg-[#1b1b1b];
}
.modal-header {
  background:
    linear-gradient(
      100deg,
      rgb(from var(--g1) r g b / 0.15),
      rgb(from var(--g2) r g b / 0.15),
      rgb(from var(--g3) r g b / 0.15),
      rgb(from var(--g4) r g b / 0.15)
    );
  @apply bg-[#1b1b1b];
}
.minified-talk-bg {
  background:
    linear-gradient(
      100deg,
      rgb(from var(--g1) r g b / 0.1),
      rgb(from var(--g2) r g b / 0.1),
      rgb(from var(--g3) r g b / 0.1),
      rgb(from var(--g4) r g b / 0.1)
    ) padding-box,
    linear-gradient(
      -10deg,
      rgb(from var(--g1) r g b / 0.1),
      rgb(from var(--g2) r g b / 0.1),
      rgb(from var(--g3) r g b / 0.1),
      rgb(from var(--g4) r g b / 0.1)
    ) border-box;
}
.minified-row.past-talk {
  border-left-color: var(--g3);
}
:global(.pinned-talk) {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  height: 52px;
  padding: 0 1rem;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.875rem;
}
:global(.pinned-speaker) {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-robot-700);
}
:global(.pinned-talk-label) {
  font-weight: 700;
  color: var(--g1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;
}
:global(.pinned-talk-title) {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
:global(.pinned-talk-btn) {
  border: 1px solid var(--g2);
  color: var(--g2);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  flex-shrink: 0;
  &:hover {
    background: var(--g2);
    color: white;
  }
}
:global(.pinned-countdown) {
  flex-shrink: 0;
  padding: 0;
}
:global(.pinned-countdown .agenda-countdown) {
  padding: 0;
  gap: 0.25rem;
}
:global(.pinned-countdown .countdown-value) {
  font-size: 1.25rem;
}
:global(.pinned-countdown .countdown-unit) {
  font-size: 0.75rem;
}
:global(.pinned-countdown .agenda-countdown > .text-sm) {
  display: none;
}
@media screen and (max-width: 600px) {
  .time-extra {
    display: none;
  }
}
</style>
