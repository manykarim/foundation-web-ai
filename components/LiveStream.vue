<template>
    <div>
        <div class="controls">
            <div class="flex items-center gap-2">
                <button class="small type-small" v-for="(stream, key) in streams" :key="stream.name"
                    :class="selectedDay === key ? 'primary' : 'secondary'" @click="switchDay(key)">{{ stream.name }}</button>
                <button v-if="isWithinStreamDay" class="watch-live-btn small type-small" @click="jumpToLive">
                    Watch Live
                </button>
                <button
                    v-if="anyInstanceActive"
                    class="show-in-agenda-btn small type-small"
                    @click="scrollToAgenda"
                >
                    Show Agenda
                </button>
                <button
                    v-if="!isNarrow && !streamExtracted"
                    class="popout-btn small type-small"
                    @click="popOutStream"
                    title="Pop out stream"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </button>
            </div>
            <div class="flex items-center gap-2">
                <button
                    v-if="activeSlidoUrl && !isNarrow && !chatExtracted"
                    class="popout-btn small type-small"
                    @click="popOutChat"
                    title="Pop out Q&amp;A"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </button>
                <button v-if="activeSlidoUrl" @click="showChat = !showChat" class="theme small type-small">
                    {{ showChat ? 'Hide Q&amp;A' : 'Show Q&amp;A' }}
                </button>
            </div>
        </div>
        <div v-if="streamExtracted" class="extracted-placeholder">
            <p>Stream is in a separate window</p>
            <button class="integrate-btn small type-small" @click="integrateBack('stream')">Integrate Back</button>
        </div>
        <div v-if="chatExtracted && activeSlidoUrl" class="extracted-placeholder">
            <p>Q&amp;A is in a separate window</p>
            <button class="integrate-btn small type-small" @click="integrateBack('chat')">Integrate Back</button>
        </div>
        <div v-if="!streamExtracted || (!chatExtracted && activeSlidoUrl && showChat)" class="stream-container" ref="streamContainer" :class="[isFullscreen && 'fullscreen', isDragging && 'dragging']">
            <template v-if="!streamExtracted">
                <div v-show="!isNarrow || !showChat" class="stream" ref="playerContainer"
                    :style="resizableLayout ? { flexBasis: `calc(${streamPercent}% - 3px)` } : undefined"
                    :class="{ 'stream-grow': !showChat || chatExtracted || !activeSlidoUrl }">
                    <div :id="playerId"></div>
                </div>
            </template>
            <div
                v-if="activeSlidoUrl && resizableLayout && !chatExtracted && !streamExtracted"
                class="resize-handle"
                :class="{ snapped: isSnapped }"
                @mousedown.prevent="startDrag"
                @touchstart.prevent="startDrag"
            ></div>
            <template v-if="!chatExtracted">
                <iframe v-if="activeSlidoUrl" v-show="showChat" class="chat" :src="activeSlidoUrl" frameBorder="0"
                    title="Stream chat"
                    :class="{ 'chat-full': streamExtracted }"
                    :style="resizableLayout && !streamExtracted ? { flexBasis: `calc(${100 - streamPercent}% - 3px)` } : undefined"></iframe>
            </template>
        </div>
        <div id="pinned-talk-target"></div>
        <template v-if="!agendaExtracted">
            <div class="body-header" v-if="fields.body && !isNarrow">
                <button
                    class="popout-btn small type-small"
                    @click="popOutAgenda"
                    title="Pop out agenda"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    Pop Out Agenda
                </button>
            </div>
            <div v-if="fields.body" ref="bodyContainer" class="body-content px-4" :class="[fields.bodyWidth]">
                <RichTextRenderer :document="fields.body" :node-renderers="renderNode()" />
            </div>
        </template>
        <div v-else class="extracted-placeholder agenda-placeholder">
            <p>Agenda is in a separate window</p>
            <button class="integrate-btn small type-small" @click="integrateBack('agenda')">Integrate Back</button>
        </div>
        <Teleport to="body">
            <button
                v-if="playerOutOfView && showLiveControls && !streamExtracted"
                class="floating-to-stream"
                @click="scrollToTop"
            >
                To Stream
            </button>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import RichTextRenderer from 'contentful-rich-text-vue-renderer'
import { differenceInSeconds } from 'date-fns'
import type { LiveStreamFields } from '~/types/contentful'

interface StreamDay {
    name: string
    id: string
    start: string
    end: string
}

const props = defineProps<{
    fields: LiveStreamFields
}>()

const { anyInstanceActive } = useAgendaState('livestream')
const { popOut, integrateBack, isExtracted, onSeek, initMainPage, sendStateSync } = usePopout()

const streamExtracted = isExtracted('stream')
const chatExtracted = isExtracted('chat')
const agendaExtracted = isExtracted('agenda')

const isFullscreen = ref(false)
const selectedDay = ref(0)
const isNarrow = ref(false)
const showChat = ref(true)
const streamPercent = ref(70)
const isDragging = ref(false)
const playerId = 'yt-stream-player'
const playerContainer = ref<HTMLElement | null>(null)
const bodyContainer = ref<HTMLElement | null>(null)
const streamContainer = ref<HTMLElement | null>(null)
const playerOutOfView = ref(false)

let ytPlayer: any = null
let ytReady = false
let observer: IntersectionObserver | null = null
let streamDayInterval: ReturnType<typeof setInterval> | null = null

const activeSlidoUrl = computed(() => {
    if (props.fields.slidoQaUrl) return props.fields.slidoQaUrl
    if (selectedDay.value === 0) return props.fields.dayOneQaUrl || ''
    if (selectedDay.value === 1) return props.fields.dayTwoQaUrl || ''
    return ''
})

const streams = computed<StreamDay[]>(() => {
    const days: StreamDay[] = [
        {
            name: props.fields.dayOneName,
            id: props.fields.dayOneLiveStreamId,
            start: props.fields.dayOneStart,
            end: props.fields.dayOneEnd,
        },
    ]
    if (props.fields.dayTwoName && props.fields.dayTwoStart && props.fields.dayTwoEnd && props.fields.dayTwoLiveStreamId) {
        days.push({
            name: props.fields.dayTwoName,
            id: props.fields.dayTwoLiveStreamId,
            start: props.fields.dayTwoStart,
            end: props.fields.dayTwoEnd,
        })
    }
    return days
})

const isWithinStreamDay = ref(false)

function checkWithinStreamDay() {
    const now = new Date()
    isWithinStreamDay.value = streams.value.some(s => now >= new Date(s.start) && now < new Date(s.end))
}

const showLiveControls = computed(() => isWithinStreamDay.value || anyInstanceActive.value)

function jumpToLive() {
    const now = new Date()
    const dayIndex = streams.value.findIndex(s => now >= new Date(s.start) && now < new Date(s.end))
    if (dayIndex >= 0) {
        seekToStream(dayIndex, 99999999)
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

function scrollToAgenda() {
    bodyContainer.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function autoSelectDay() {
    const now = new Date()
    const autoDay = streams.value.findIndex(s => now >= new Date(s.start) && now < new Date(s.end))
    if (autoDay >= 0) {
        selectedDay.value = autoDay
    } else {
        // No day is currently live — pick the next upcoming day (countdown target)
        const nextDay = streams.value.findIndex(s => now < new Date(s.start))
        if (nextDay >= 0) {
            selectedDay.value = nextDay
        } else {
            // All days are in the past — pick the last one
            const pastDays = streams.value.filter(s => now >= new Date(s.start))
            if (pastDays.length > 0) {
                selectedDay.value = streams.value.indexOf(pastDays[pastDays.length - 1])
            }
        }
    }
}

function loadYTApi(): Promise<void> {
    return new Promise((resolve) => {
        if ((window as any).YT?.Player) {
            resolve()
            return
        }
        if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
            const tag = document.createElement('script')
            tag.src = 'https://www.youtube.com/iframe_api'
            document.head.appendChild(tag)
        }
        const prev = (window as any).onYouTubeIframeAPIReady
        ;(window as any).onYouTubeIframeAPIReady = () => {
            prev?.()
            resolve()
        }
        const poll = setInterval(() => {
            if ((window as any).YT?.Player) {
                clearInterval(poll)
                resolve()
            }
        }, 100)
    })
}

function destroyPlayer() {
    if (ytPlayer) {
        ytPlayer.destroy()
        ytPlayer = null
        ytReady = false
    }
    const container = document.getElementById(playerId)
    if (!container) {
        const wrapper = playerContainer.value
        if (wrapper) {
            const div = document.createElement('div')
            div.id = playerId
            wrapper.appendChild(div)
        }
    }
}

function createPlayer(videoId: string, startSeconds?: number) {
    if (!videoId) return
    if (streamExtracted.value) return
    destroyPlayer()
    ytPlayer = new (window as any).YT.Player(playerId, {
        videoId,
        playerVars: {
            autoplay: 1,
            modestbranding: 1,
            rel: 0,
            ...(startSeconds != null && { start: startSeconds }),
        },
        events: {
            onReady: () => { ytReady = true },
        },
    })
}

function switchDay(dayIndex: number) {
    selectedDay.value = dayIndex
    createPlayer(streams.value[dayIndex].id)
    sendStateSync(dayIndex, streams.value[dayIndex].id)
}

function seekToStream(dayIndex: number, offsetSeconds: number) {
    const videoId = streams.value[dayIndex].id
    if (!videoId) return
    if (streamExtracted.value) {
        sendStateSync(dayIndex, videoId)
        return
    }
    if (selectedDay.value === dayIndex && ytPlayer && ytReady) {
        ytPlayer.seekTo(offsetSeconds, true)
    } else {
        selectedDay.value = dayIndex
        createPlayer(videoId, offsetSeconds)
    }
}

function jumpToStreamTime(talkStart: string, live?: boolean) {
    const talkDate = new Date(talkStart)
    const dayIndex = streams.value.findIndex(
        d => talkDate >= new Date(d.start) && talkDate < new Date(d.end)
    )
    if (dayIndex < 0) return
    if (live) {
        seekToStream(dayIndex, 99999999)
    } else {
        const dayStart = new Date(streams.value[dayIndex].start)
        const offsetSeconds = differenceInSeconds(talkDate, dayStart)
        seekToStream(dayIndex, offsetSeconds)
    }
}

provide('jumpToStreamTime', jumpToStreamTime)
provide('scrollContainer', bodyContainer)

// --- Pop-out helpers ---
function buildStreamQuery() {
    const q: Record<string, string> = {
        day: String(selectedDay.value),
        day1Name: streams.value[0]?.name || '',
        day1Id: streams.value[0]?.id || '',
    }
    if (streams.value[1]) {
        q.day2Name = streams.value[1].name
        q.day2Id = streams.value[1].id
    }
    const currentTime = ytPlayer && ytReady ? Math.floor(ytPlayer.getCurrentTime?.() || 0) : undefined
    if (currentTime) q.startSeconds = String(currentTime)
    return new URLSearchParams(q).toString()
}

function buildAgendaQuery() {
    const q: Record<string, string> = {
        slug: '/stream',
        day1Start: streams.value[0]?.start || '',
        day1End: streams.value[0]?.end || '',
    }
    if (streams.value[1]) {
        q.day2Start = streams.value[1].start
        q.day2End = streams.value[1].end
    }
    return new URLSearchParams(q).toString()
}

function popOutStream() {
    destroyPlayer()
    popOut('stream', `/popup/stream?${buildStreamQuery()}`)
}

function popOutChat() {
    const q = new URLSearchParams({ slidoUrl: activeSlidoUrl.value }).toString()
    popOut('chat', `/popup/chat?${q}`)
}

function popOutAgenda() {
    // Store the liveStream body in sessionStorage so the popup can render just the agenda
    if (props.fields.body) {
        try { sessionStorage.setItem('popout-agenda-body', JSON.stringify(props.fields.body)) } catch {}
    }
    popOut('agenda', `/popup/agenda?${buildAgendaQuery()}`)
}

// Listen for seek messages from popup agenda
onSeek.value = (dayIndex: number, offsetSeconds: number) => {
    seekToStream(dayIndex, offsetSeconds)
}

// When stream comes back from extracted, recreate player
watch(streamExtracted, async (extracted) => {
    if (!extracted) {
        await nextTick()
        await loadYTApi()
        await nextTick()
        createPlayer(streams.value[selectedDay.value].id)
    }
})

// --- Resize handle logic ---
const SNAP_THRESHOLD = 2 // percentage points
const HANDLE_WIDTH = 6

const resizableLayout = computed(() => !isNarrow.value && showChat.value && !chatExtracted.value && !!activeSlidoUrl.value)

const isSnapped = computed(() => {
    const container = streamContainer.value
    if (!container) return false
    const { width, height } = container.getBoundingClientRect()
    if (width === 0 || height === 0) return false
    const snapPercent = (height * 16 / 9) / width * 100
    return snapPercent >= 30 && snapPercent <= 85 && Math.abs(streamPercent.value - snapPercent) < 0.5
})

function getClientX(e: MouseEvent | TouchEvent): number {
    return 'touches' in e ? e.touches[0].clientX : e.clientX
}

function onDragMove(e: MouseEvent | TouchEvent) {
    const container = streamContainer.value
    if (!container) return
    if ('cancelable' in e && e.cancelable) e.preventDefault()
    const rect = container.getBoundingClientRect()
    let percent = ((getClientX(e) - rect.left - HANDLE_WIDTH / 2) / (rect.width - HANDLE_WIDTH)) * 100
    percent = Math.max(30, Math.min(85, percent))

    const snapPercent = (rect.height * 16 / 9) / rect.width * 100
    if (snapPercent >= 30 && snapPercent <= 85 && Math.abs(percent - snapPercent) < SNAP_THRESHOLD) {
        percent = snapPercent
    }

    streamPercent.value = percent
}

function stopDrag() {
    if (!isDragging.value) return
    isDragging.value = false
    window.removeEventListener('mousemove', onDragMove)
    window.removeEventListener('mouseup', stopDrag)
    window.removeEventListener('touchmove', onDragMove)
    window.removeEventListener('touchend', stopDrag)
}

function startDrag() {
    if (isDragging.value) return
    isDragging.value = true
    window.addEventListener('mousemove', onDragMove)
    window.addEventListener('mouseup', stopDrag)
    window.addEventListener('touchmove', onDragMove, { passive: false })
    window.addEventListener('touchend', stopDrag)
}
function checkNarrow() {
    const narrow = window.innerWidth < 1000
    if (narrow !== isNarrow.value) {
        isNarrow.value = narrow
        showChat.value = !narrow
    }
}

onMounted(async () => {
    isFullscreen.value = localStorage.getItem('attendee') === 'gather'
    checkNarrow()
    window.addEventListener('resize', checkNarrow)

    initMainPage()

    autoSelectDay()
    checkWithinStreamDay()
    streamDayInterval = setInterval(checkWithinStreamDay, 10000)

    // IntersectionObserver for floating button
    if (streamContainer.value) {
        observer = new IntersectionObserver(
            ([entry]) => {
                playerOutOfView.value = !entry.isIntersecting
            },
            { threshold: 0 }
        )
        observer.observe(streamContainer.value)
    }

    await loadYTApi()
    await nextTick()
    if (!streamExtracted.value) {
        createPlayer(streams.value[selectedDay.value].id)
    }
})

onUnmounted(() => {
    window.removeEventListener('resize', checkNarrow)
    stopDrag()
    if (observer) {
        observer.disconnect()
        observer = null
    }
    if (streamDayInterval) {
        clearInterval(streamDayInterval)
        streamDayInterval = null
    }
})
</script>

<style scoped>
.narrow { @apply max-w-[1024px] mx-auto; }
.default { @apply max-w-[1280px] mx-auto; }
.wide { @apply max-w-[1400px] mx-auto; }
.full { @apply w-full; }

.controls {
    display: flex;
    justify-content: space-between;
    height: 66px;
    align-items: center;
}
.stream-container {
    display: flex;
    flex-wrap: wrap;
    min-height: calc(100vh - 7rem - 48px);
    width: 100%;

    .stream {
        flex-basis: 70%;
        min-width: 0;

        &.stream-grow {
            flex-grow: 1;
        }

        :deep(iframe) {
            width: 100%;
            height: 100%;
        }
    }

    .chat {
        flex-basis: 30%;

        &.chat-full {
            flex-basis: 100%;
        }
    }

    .resize-handle {
        width: 6px;
        cursor: col-resize;
        background: transparent;
        position: relative;
        flex-shrink: 0;
        z-index: 1;
        touch-action: none;
        transition: background 0.15s;

        &:hover, &.snapped {
            background: var(--g1, #888);
            opacity: 0.5;
        }

        &::before {
            content: '';
            position: absolute;
            inset: 0 -6px;
        }
    }

    &.dragging {
        cursor: col-resize;
        user-select: none;

        :deep(iframe) {
            pointer-events: none;
        }

        .resize-handle {
            background: var(--g1, #888);
            opacity: 0.5;
        }
    }
}

.stream-container.fullscreen {
    min-height: calc(100vh - 72px);
}

.body-content {
    padding-top: 2rem;
    padding-bottom: 2rem;
}

.body-header {
    display: flex;
    justify-content: flex-end;
    padding: 0.5rem 1rem 0;
}

@media screen and (min-width: 1000px) {
    .stream-container {
        flex-wrap: nowrap;
    }
    .body-content {
        max-height: 60vh;
        overflow-y: auto;
    }
}

@media screen and (max-width: 999px) {
    .stream-container .chat {
        flex-basis: 100%;
        width: 100%;
        min-height: calc(100vh - 7rem);
    }
    .popout-btn {
        display: none;
    }
}

.watch-live-btn {
    border: 1px solid var(--g1);
    color: var(--g1);
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    &:hover {
        background: var(--g1);
        color: white;
    }
}

.show-in-agenda-btn {
    border: 1px solid var(--g2);
    color: var(--g2);
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    &:hover {
        background: var(--g2);
        color: white;
    }
}

.popout-btn {
    border: 1px solid var(--g1, #888);
    color: var(--g1, #888);
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    &:hover {
        background: var(--g1, #888);
        color: white;
    }
}

.extracted-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    border: 1px dashed var(--g1, #555);
    border-radius: 0.25rem;
    color: var(--g1, #888);
    font-size: 0.75rem;
    padding: 0.5rem 1rem;
    background: rgba(255,255,255,0.03);

    p {
        opacity: 0.7;
        margin: 0;
    }
}

.agenda-placeholder {
    margin: 0.5rem 1rem;
}

.integrate-btn {
    border: 1px dashed var(--g1, #888);
    color: var(--g1, #888);
    background: transparent;
    cursor: pointer;
    white-space: nowrap;
    &:hover {
        background: var(--g1, #888);
        color: white;
    }
}

.floating-to-stream {
    position: fixed;
    top: 56px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 40;
    padding: 0.375rem 1.25rem;
    border-radius: 9999px;
    border: 1px solid var(--g1);
    background: rgba(0, 0, 0, 0.85);
    color: var(--g1);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    backdrop-filter: blur(8px);
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    &:hover {
        background: var(--g1);
        color: white;
    }
}
</style>
