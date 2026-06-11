<template>
    <div class="relative" @mouseenter="isOpen = true" @mouseleave="isOpen = false">
        <button class="hover:underline underline-offset-4 flex items-center gap-1" @click="isOpen = !isOpen">
            <component :is="icon" class="w-4 h-4" />
            {{ label }}
            <ChevronDown class="w-4 h-4 translate-y-[1px]" />
        </button>

        <div v-if="isOpen" class="absolute top-full pt-4 left-0 w-40">
            <a
                v-for="item in items" :key="item.path" :href="item.path"
                class="secondary flex items-center gap-2">
                <component :is="item.icon" class="w-4 h-4" />
                {{ item.label }}
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ChevronDown, type IconNode } from 'lucide-vue-next'

const isOpen = ref(false)

defineProps<{
    label: string
    icon?: string
    items: Array<{
        label: string
        path: string
        icon: IconNode
    }>
}>()
</script>