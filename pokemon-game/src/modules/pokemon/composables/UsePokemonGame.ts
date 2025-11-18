import { computed, onMounted, ref } from 'vue';
import { GameStatus, type Pokemon, type PokemonListResponse } from '../interfaces';
import pokemonApi from '../api/pokemonApi';
import confetti from 'canvas-confetti';

export const usePokemonGame = () => {
  const gameStatus = ref<GameStatus>(GameStatus.Playing);
  const pokemons = ref<Pokemon[]>([]);
  const pokemonOptions = ref<Pokemon[]>([]);

  const randomPokemon = computed(() => {
    const randomIndex = Math.floor(Math.random() * pokemonOptions.value.length);
    return pokemonOptions.value[randomIndex];
  });

  const isLoading = computed(() => pokemons.value.length === 0);

  const getPokemons = async (): Promise<Pokemon[]> => {
    const response = await pokemonApi.get<PokemonListResponse>('/pokemon?limit=151');

    const pokemonsArray: Pokemon[] = response.data.results.map((pokemon, index) => ({
      id: index + 1,
      name: pokemon.name,
    }));

    return pokemonsArray.sort(() => Math.random() - 0.5);
  };

  const getNextOptions = (howMany: number = 4) => {
    gameStatus.value = GameStatus.Playing;

    pokemonOptions.value = pokemons.value.slice(0, howMany);
    pokemons.value = pokemons.value.slice(howMany);
  };

function randomInRange(min:number, max:number) {
  return Math.random() * (max - min) + min;
}


const checkanswer = (id:number) => {
  const hasWon = randomPokemon.value?.id === id;

  if (hasWon) {
    gameStatus.value = GameStatus.Won;
    confetti({
      angle: randomInRange(40, 140),
      spread: randomInRange(80, 100),
      particleCount: 200,
      origin: { y: randomInRange(0.5, 1), x: randomInRange(0.3, 0.7) },
      decay: 0.9,
    });
    return;
  }

  gameStatus.value = GameStatus.Lost;
};

  onMounted(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    pokemons.value = await getPokemons();

    getNextOptions();

    console.log(pokemonOptions.value);
  });

  return {
    gameStatus,
    isLoading,
    randomPokemon,
    // Methods
    getNextOptions,
    checkanswer,
    // Data
    pokemonOptions,
  };
};
