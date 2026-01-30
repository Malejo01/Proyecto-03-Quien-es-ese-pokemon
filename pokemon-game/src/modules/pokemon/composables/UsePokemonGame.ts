import { computed, onMounted, ref } from 'vue';
import { GameStatus, type Pokemon, type PokemonListResponse } from '../interfaces';
import pokemonApi from '../api/pokemonApi';
import confetti from 'canvas-confetti';
import { useAudio } from './useAudio';

export const usePokemonGame = () => {
  const gameStatus = ref<GameStatus>(GameStatus.Playing);
  const pokemons = ref<Pokemon[]>([]);
  const pokemonOptions = ref<Pokemon[]>([]);
  const roundsPlayed = ref<number>(0);
  const correctAnswers = ref<number>(0);
  const lives = ref<number>(3);
  const manualDifficulty = ref<string>('Easy');
  const score = ref<number>(0);
  const isGameOver = ref<boolean>(false);
  const totalPokemonsLoaded = ref<number>(151);
  const correctAnswerStreak = ref<number>(0);

  const audioControls = useAudio();

  const randomPokemon = computed(() => {
    const randomIndex = Math.floor(Math.random() * pokemonOptions.value.length);
    return pokemonOptions.value[randomIndex];
  });

  const isLoading = computed(() => pokemons.value.length === 0);

  const difficulty = computed(() => {
    return manualDifficulty.value;
  });

  const optionsCount = computed(() => {
    const diff = difficulty.value;
    if (diff === 'Easy') return 4;
    if (diff === 'Normal') return 6;
    if (diff === 'Hard') return 8; // Hard
    // Extreme mode uses a single pokemon and a text input
    if (diff === 'Extreme') return 1;
    return 8;
  });

  const pointsPerCorrectAnswer = computed(() => {
    const diff = difficulty.value;
    if (diff === 'Easy') return 2;
    if (diff === 'Normal') return 3;
    if (diff === 'Hard') return 4; // Hard
    if (diff === 'Extreme') return 10; // Extreme
    return 4;
  });

  const getPokemons = async (limit: number = 151): Promise<Pokemon[]> => {
    const response = await pokemonApi.get<PokemonListResponse>(`/pokemon?limit=${limit}`);

    const pokemonsArray: Pokemon[] = response.data.results.map((pokemon, index) => ({
      id: index + 1,
      name: pokemon.name,
    }));

    return pokemonsArray.sort(() => Math.random() - 0.5);
  };

  const loadMorePokemons = async () => {
    const newLimit = totalPokemonsLoaded.value + 20;
    const allPokemons = await getPokemons(newLimit);

    // Get only the new Pokémon (from the previous limit to the new limit)
    const newPokemons = allPokemons.filter((p) => p.id > totalPokemonsLoaded.value);

    // Add new Pokémon to the existing pool
    pokemons.value = [...pokemons.value, ...newPokemons];
    totalPokemonsLoaded.value = newLimit;
  };

  const getNextRound = async () => {
    if (isGameOver.value) return;

    gameStatus.value = GameStatus.Playing;
    roundsPlayed.value++;

    // Load more Pokémon every round (except the first one)
    if (roundsPlayed.value > 1) {
      await loadMorePokemons();
    }

    const howMany = optionsCount.value;

    pokemonOptions.value = pokemons.value.slice(0, howMany);
    pokemons.value = pokemons.value.slice(howMany);
  };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const checkanswer = (id: number) => {
    const hasWon = randomPokemon.value?.id === id;

    if (hasWon) {
      gameStatus.value = GameStatus.Won;
      correctAnswers.value++;
      score.value += pointsPerCorrectAnswer.value;
      audioControls.playCorrectSound();
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
    lives.value--;
    audioControls.playWrongSound();

    if (lives.value === 0) {
      isGameOver.value = true;
      audioControls.playGameOverSound();
    }
  };

  /**
   * Check answer by name for Extreme mode.
   * Returns an object with { ok: boolean, reason?: string }
   */
  const levenshtein = (a: string, b: string) => {
    const an = a.length;
    const bn = b.length;
    if (an === 0) return bn;
    if (bn === 0) return an;
    const row = new Array(bn + 1).fill(0).map((_, i) => i);
    for (let i = 1; i <= an; i++) {
      let prev = row[0];
      row[0] = i;
      for (let j = 1; j <= bn; j++) {
        const cur = row[j];
        const add = prev + (a[i - 1] === b[j - 1] ? 0 : 1);
        const del = row[j] + 1;
        const sub = row[j - 1] + 1;
        prev = cur;
        row[j] = Math.min(add, del, sub);
      }
    }
    return row[bn];
  };

  const checkAnswerByName = (name: string) => {
    if (!name || typeof name !== 'string') return { ok: false, reason: 'invalid' };

    // Disallow special characters in input (only letters, numbers and spaces)
    if (!/^[a-zA-Z0-9\s]+$/.test(name)) return { ok: false, reason: 'invalid-chars' };

    const target = randomPokemon.value?.name || '';

    const normalize = (s: string) => s.replace(/[^a-z0-9]/gi, '').toLowerCase();

    const inputNorm = normalize(name);
    const targetNorm = normalize(target);

    const distance = levenshtein(inputNorm, targetNorm);

    if (distance === 0) {
      // Correct answer
      gameStatus.value = GameStatus.Won;
      correctAnswers.value++;
      correctAnswerStreak.value++;

      // Calculate points based on streak
      let pointsToAdd = 10; // Base points for Extreme mode
      if (correctAnswerStreak.value > 2) {
        // Add bonus points for streak (1 extra point per correct answer beyond 2)
        pointsToAdd = 10 + (correctAnswerStreak.value - 2);
      }

      score.value += pointsToAdd;
      audioControls.playCorrectSound();
      confetti({
        angle: randomInRange(40, 140),
        spread: randomInRange(80, 100),
        particleCount: 200,
        origin: { y: randomInRange(0.5, 1), x: randomInRange(0.3, 0.7) },
        decay: 0.9,
      });
      return { ok: true, correctName: target };
    }

    // Almost correct: distance of 1
    if (distance === 1) {
      const halfPoints = Math.floor(10 / 2); // 5 points for almost
      gameStatus.value = GameStatus.Won;
      correctAnswers.value++;
      correctAnswerStreak.value++;

      score.value += halfPoints;
      audioControls.playCorrectSound();
      return { ok: false, almost: true, pointsAwarded: halfPoints, correctName: target };
    }

    // Wrong answer - reset streak
    correctAnswerStreak.value = 0;
    gameStatus.value = GameStatus.Lost;
    lives.value--;
    audioControls.playWrongSound();
    if (lives.value === 0) {
      isGameOver.value = true;
      audioControls.playGameOverSound();
    }

    return { ok: false, reason: 'wrong', correctName: target };
  };

  const setDifficulty = async (level: string) => {
    manualDifficulty.value = level;
    await resetGame();
  };

  const resetGame = async () => {
    gameStatus.value = GameStatus.Playing;
    roundsPlayed.value = 0;
    correctAnswers.value = 0;
    correctAnswerStreak.value = 0;
    lives.value = 3;
    score.value = 0;
    isGameOver.value = false;
    totalPokemonsLoaded.value = 151;

    pokemons.value = await getPokemons(151);
    getNextRound();
  };

  onMounted(async () => {
    // Step 1: Preload all audio files first
    await audioControls.preloadAllAudio();

    // Step 2: Load Pokémon data
    pokemons.value = await getPokemons(151);

    // Step 3: Start background music and game
    audioControls.playBackgroundMusic();
    getNextRound();

    console.log(pokemonOptions.value);
  });

  return {
    gameStatus,
    isLoading,
    randomPokemon,
    difficulty,
    roundsPlayed,
    correctAnswers,
    lives,
    score,
    pointsPerCorrectAnswer,
    isGameOver,
    audioControls,
    // Methods
    getNextRound,
    checkanswer,
    checkAnswerByName,
    resetGame,
    setDifficulty,
    // Data
    pokemonOptions,
    correctAnswerStreak,
  };
};
