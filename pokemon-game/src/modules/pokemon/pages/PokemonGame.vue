<template>
  <section v-if="isLoading|| randomPokemon?.id == null" class="flex flex-col justify-center items-center w-screen h-screen">
    <h1 class="text-3xl font-bold mb-5">¡Bienvenido al juego Pokemon!</h1>
    <h3 class="animate-pulse">Cargando...</h3>
  </section>

  <section v-else class="flex flex-col justify-center items-center w-screen h-screen">
    <h1 class="text-3xl font-bold m-2">¿Quien es este pokemon?</h1>
    <div class="h-20">
      <button v-if="gameStatus !== GameStatus.Playing" @click="getNextRound(4)" class="bg-green-500 shadow-md p-3 text-white rounded cursor-pointer hover:bg-green-700 w-40 text-center transition-all">
        Siguiente
      </button>
    </div>
    <PokemonPicture :pokemon-id="randomPokemon?.id" :show-pokemon="gameStatus !== GameStatus.Playing"/>


    <PokemonOptions
      :options="options"
      :block-selection="gameStatus !== GameStatus.Playing"
      :correct-answer="randomPokemon?.id"
      @selectedOption="onSelectedOption"

    />
  </section>
</template>

<script setup lang="ts">
import PokemonPicture from '../components/PokemonPicture.vue';
import PokemonOptions from '../components/PokemonOptions.vue';
import { usePokemonGame } from '../composables/UsePokemonGame';
import { GameStatus } from '../interfaces';

const { randomPokemon, isLoading, gameStatus, pokemonOptions:options, checkanswer, getNextRound } = usePokemonGame();

const onSelectedOption = (id: number) => {
  checkanswer(id);
}

</script>
