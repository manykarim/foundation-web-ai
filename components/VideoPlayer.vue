<template>
  <div class="video-container">
    <div class="video-list p-4">
        <div class="text-lg font-mono">
            Talks
        </div>
      <ul>
        <li
          v-for="(video, index) in fields.videos"
          :key="video.fields.url"
          :class="selectedIndex === index ? 'active' : ''"
        >
          <button @click="selectedIndex = index">
            {{ video.fields.title }}
          </button>
        </li>
      </ul>
    </div>

    <div class="player md:p-4">
      <iframe
        v-if="currentVideoUrl"
        :src="currentVideoUrl"
        frameborder="0"
        allowfullscreen
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { VideoPlayerFields } from '~/types/contentful';

const props = defineProps<{
    fields: VideoPlayerFields
}>()

const selectedIndex = ref(0);

const currentVideoUrl = computed(() => {
  return props.fields.videos?.[selectedIndex.value]?.fields?.url || '';
});

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

  ul {
    padding-left: 0;

    li {
        list-style: none;
        padding: 0.5rem;

        &.active {
            background-color: rgba(255, 255, 255, 0.2);
        }
    }
  }

  button {
    text-align: left;
  }
}

.player {
  flex: 1 1 100%;

  iframe {
    width: 100%;
    aspect-ratio: 16/9;
  }
}

@media screen and (max-width: 1024px) {
    .video-container {
        flex-wrap: wrap;
    }
    .video-list {
        flex: 0 0 100%;
        height: 100%;
        order: 2;
    }
    .player {
        flex: 0 0 100%;
        order: 1;
    }
}
</style>
