<template>
  <div class="mt-3 md:mt-5 flex flex-col items-center w-full px-2">
    <div :class="[
      'flex gap-2',
      options.length > 3 ? 'flex-row flex-wrap justify-center max-w-2xl' : 'flex-col items-center'
    ]">
      <button
        v-for="{name, id} in options"
        :key="id"
        @click="$emit('selectedOption', id)"
        :class="['capitalize disabled:shadow-none disabled:bg-gray-100' ,
        {
          correct:id === correctAnswer && blockSelection,
          incorrect:id !== correctAnswer && blockSelection
        }]"
        :disabled="blockSelection">
        {{ name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Pokemon } from '../interfaces';

interface Props {
  options: Pokemon[];
  blockSelection?: boolean;
  correctAnswer?: number;
}

defineProps<Props>();

defineEmits<{
  selectedOption: [id: number];
}>();
</script>

<style scoped>
@import 'tailwindcss/theme' reference;

button {
  @apply bg-blue-500 shadow-md mb-2 p-2 md:p-3 text-white rounded cursor-pointer hover:bg-blue-700 w-32 md:w-40 text-center transition-all text-sm md:text-base;
}

.correct {
  @apply bg-green-500 shadow-md mb-2 p-2 md:p-3 text-white rounded cursor-pointer hover:bg-green-700 w-32 md:w-40 text-center transition-all text-sm md:text-base;
}

.incorrect {
  @apply bg-red-500 shadow-md mb-2 p-2 md:p-3 text-white rounded cursor-pointer hover:bg-red-700 w-32 md:w-40 text-center transition-all text-sm md:text-base;
}
</style>
