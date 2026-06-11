<template>
  <div class="video-container">
    <div class="video-list p-4">
      <div class="text-lg font-mono">Talks</div>
      <ul>
        <li
          v-for="(video, index) in videoList"
          :key="video.url"
          :class="selectedIndex === index ? 'active' : ''">
          <button @click="selectedIndex = index">{{ video.title }}</button>
        </li>
      </ul>
    </div>
    <div class="player md:p-4">
      <iframe
        v-if="currentVideoUrl"
        :src="currentVideoUrl"
        frameborder="0"
        allowfullscreen />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  videos: string
}>()

const videoList = computed(() => {
  try {
    return JSON.parse(props.videos) as { title: string; url: string }[]
  } catch {
    return []
  }
})

const selectedIndex = ref(0)

const currentVideoUrl = computed(() => {
  return videoList.value[selectedIndex.value]?.url || ''
})
</script>

<style scoped>
.video-container {
  display: flex;
  flex-wrap: nowrap;
  max-width: 1280px;
  margin: 0 auto;
}
.video-list {
  flex: 0 0 27rem;
  overflow-y: auto;
  border-right: 1px solid #ccc;
  padding-right: 0.5rem;
  max-height: 34rem;
}
.video-list ul {
  padding-left: 0;
}
.video-list li {
  list-style: none;
  padding: 0.5rem;
}
.video-list li.active {
  background-color: rgba(255, 255, 255, 0.2);
}
.video-list button {
  text-align: left;
}
.player {
  flex: 1 1 100%;
}
.player iframe {
  width: 100%;
  aspect-ratio: 16/9;
}
@media screen and (max-width: 1024px) {
  .video-container { flex-wrap: wrap; }
  .video-list { flex: 0 0 100%; height: 100%; order: 2; }
  .player { flex: 0 0 100%; order: 1; }
}
</style>
