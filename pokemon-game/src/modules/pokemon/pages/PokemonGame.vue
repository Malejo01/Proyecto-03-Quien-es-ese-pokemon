<template>
  <section v-if="isLoading|| randomPokemon?.id == null" class="flex flex-col justify-center items-center w-screen h-screen">
    <h1 class="text-3xl font-bold mb-5">¡Bienvenido al juego Pokemon!</h1>
    <h3 class="animate-pulse">Cargando...</h3>
  </section>

  <section v-else class="flex flex-col justify-center items-center w-screen h-screen">
    <h1 class="text-3xl font-bold m-2">¿Quien es este pokemon?</h1>
    <h3 class="capitalize">{{ randomPokemon?.name }}</h3>
    <PokemonPicture :pokemon-id="randomPokemon?.id" :show-pokemon="gameStatus !== GameStatus.Playing"/>


    <PokemonOptions :options="options" @selectedOption="onSelectedOption"/>
  </section>
</template>

<script setup lang="ts">
import PokemonPicture from '../components/PokemonPicture.vue';
import PokemonOptions from '../components/PokemonOptions.vue';
import { usePokemonGame } from '../composables/UsePokemonGame';
import { GameStatus } from '../interfaces';

const { randomPokemon, isLoading, gameStatus, pokemonOptions:options } = usePokemonGame();

const onSelectedOption = (id: number) => {
  console.log('Opcion seleccionada:', id);
};


</script>
