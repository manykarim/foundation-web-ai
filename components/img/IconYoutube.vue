<template>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 32.57 24"><defs><filter :id="filterId"><feMorphology operator="dilate" radius="1.2" in="SourceAlpha" result="expanded"/><feFlood flood-color="white" result="white"/><feComposite in="white" in2="expanded" operator="in" result="outline"/><feMerge><feMergeNode in="outline"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g :filter="`url(#${filterId})`"><path d="M27.9727 3.12324C27.6435 1.89323 26.6768.926623 25.4468.597366 23.2197 0 14.285 0 14.285 0S5.35042 0 3.12323.597366C1.89323.926623.926623 1.89323.597366 3.12324 0 5.35042 0 10 0 10s0 4.6496.597366 6.8768c.329257 1.23.926623 2.1966 2.156864 2.5258C5.35042 20 14.285 20 14.285 20s8.9347 0 11.1618-.5974c1.23-.3293 2.1967-1.2959 2.5259-2.5258C28.5701 14.6496 28.5701 10 28.5701 10s-.0024-4.64958-.5974-6.87676Z" fill="#FF0000"/><path d="M11.4253 14.2854 18.8477 10.0004 11.4253 5.71533v8.57007Z" fill="white"/></g></svg>
</template>

<script setup lang="ts">
const filterId = `yt-${Math.random().toString(36).slice(2, 8)}`
</script>
