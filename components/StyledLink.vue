<template>
    <a
        :href="internal ? fields.pageLink?.fields?.slug : fields.href"
        :class="[
            fields.style,
            inline ? 'inline-block mx-2' : 'block w-fit',
            fields.centered ? 'block mx-auto' : '']"
        :target="target ?? internal ? '_self' : '_blank'"
        :rel="internal ? '' : 'noopener noreferrer'">
        <img
            v-if="imageUrl"
            :src="imageUrl"
            :alt="fields.label.trim()">
        <span v-else>
            {{ fields.label.trim() }}
        </span>
        <div v-if="fields.sublabel" class="text-xs">
            {{ fields.sublabel }}
        </div>
    </a>
</template>

<script setup lang="ts">
import type { StyledLinkFields } from '~/types/contentful';

const props = defineProps<{
    fields: StyledLinkFields,
    inline: boolean,
    target?: string
}>()

const internal = props.fields.type === 'internal'
const imageUrl = props.fields.image
    ? (props.fields.image.fields.file.url + '?w=1024&h=1024').replace('downloads.', 'images.')
    : null
</script>