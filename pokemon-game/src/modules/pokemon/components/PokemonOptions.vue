<template>
  <div class="mt-5 flex flex-col items-center">
    <button
      v-for="{name, id} in options"
      :key="id" class="capitalize"
      @click="$emit('selectedOption', id)">
      {{ name }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Pokemon } from '../interfaces';

interface Props {
  options: Pokemon[];
}


defineProps<Props>();

defineEmits<{
  selectedOption: [id: number];
}>();
</script>

<style scoped>
@import 'tailwindcss/theme' reference;

button {
  @apply bg-blue-500 shadow-md mb-2 p-3 text-white rounded cursor-pointer hover:bg-blue-700 w-40 text-center transition-all;
}
</style>
