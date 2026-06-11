<template>
  <svg
    viewBox="0 0 1600 512"
    class="aurora"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="aurora-gradient" x1="0" y1="500px" x2="0" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#b7cf52" />
        <stop offset="25%" stop-color="#3f986d" />
        <stop offset="60%" stop-color="#4b3c6e" />
        <stop offset="100%" stop-color="transparent" />
      </linearGradient>

      <clipPath id="aurora-clip">
        <path
          d="M0,480 Q300,460 500,470 Q700,480 850,470 Q1000,450 1150,430 Q1300,420 1600,440 L1600,0 L0,0 Z"
        />
      </clipPath>
    </defs>

    <!-- Background -->
    <rect width="100%" height="100%" fill="black" />

    <!-- Stars -->
    <circle
      v-for="(star, i) in stars"
      :key="i"
      :cx="star.x"
      :cy="star.y"
      :r="star.r"
      class="star"
      :style="{ animationDelay: `${star.delay}s` }"
    />

    <rect
      width="1600"
      height="512"
      fill="url(#aurora-gradient)"
      clip-path="url(#aurora-clip)"
    />

    <!-- Ground silhouette -->
    <path
      d="M0,480 Q300,460 500,470 Q700,480 850,470 Q1000,450 1150,430 Q1300,420 1600,440 L1600,512 L0,512 Z"
      fill="black"
    />
  </svg>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const stars = ref(
  Array.from({ length: 30 }).map(() => ({
    x: Math.random() * 1600,
    y: Math.random() * 300,
    r: Math.random() * 1.5 + 0.5,
    delay: Math.random() * 5,
  }))
)
</script>

<style scoped>
.aurora {
  width: 100%;
  height: auto;
  display: block;
}

.star {
  fill: white;
  opacity: 0.8;
  animation: twinkle 2s infinite ease-in-out alternate;
  transform-origin: 50% 50%;
}

@keyframes twinkle {
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.9;
  }
}
</style>
