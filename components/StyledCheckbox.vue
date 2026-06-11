<template>
    <label class="border border-robot-600 dark:border-robot-200 rounded-md p-2 flex items-center cursor-pointer h-fit">
      <input
        v-model="isChecked"
        type="checkbox"
        class="opacity-0 absolute peer peer"
      >
      <div class="checkbox primary peer-checked:bg-robot-600 dark:peer-hover:bg-robot-700">
        <Check v-if="isChecked" class="text-white" />
      </div>
      <span class="ml-2 leading-none py-1">
        <slot />
      </span>
    </label>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
    import { Check } from 'lucide-vue-next'
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  const isChecked = computed({
    get() {
      return props.modelValue
    },
    set(value: boolean) {
      emit('update:modelValue', value)
    }
  })
  </script>
  