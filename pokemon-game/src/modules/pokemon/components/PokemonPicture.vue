<template>
  <div class="w-full flex justify-center mb-4">
    <img
      v-if="pokemonImagen"
      :src="pokemonImagen"
      alt="pokemon"
      class="w-48 h-48 md:w-64 md:h-64 object-contain"
      :class="{ 'brightness-0': !showPokemon }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  pokemonId?: number;
  showPokemon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showPokemon: false
});

const pokemonImagen = computed(() => {
  if (!props.pokemonId) return '';
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${props.pokemonId}.svg`;
});
</script>

<style scoped>
img {
  user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
}
</style>
