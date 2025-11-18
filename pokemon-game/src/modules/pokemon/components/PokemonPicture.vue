<template>
  <section>
    <img
      v-if="!showPokemon"
      :src="pokemonImagen"
      alt="Pokemon Picture"
      class="brightness-0 h-[200px] w-[200px]"
    />
    <img
      v-else
      :src="pokemonImagen"
      alt="Pokemon Picture"
      class="h-[200px] w-[200px] fade-in"
    />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  pokemonId: number;
  showPokemon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showPokemon: false
});

const pokemonImagen = computed(
  () => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${props.pokemonId}.svg`);

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
