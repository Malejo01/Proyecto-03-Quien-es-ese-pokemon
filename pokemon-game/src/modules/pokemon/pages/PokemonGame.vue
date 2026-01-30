<template>
  <div class="flex flex-col h-screen w-screen overflow-hidden" style="
    background: linear-gradient(135deg, #87ceeb 0%, #90ee90 50%, #ffd700 100%);
    position: relative;
  ">
    <!-- Pokemon Forest Background Pattern -->
    <div class="absolute inset-0 opacity-20 pointer-events-none" style="
      background-image:
        radial-gradient(circle at 20% 80%, rgba(34, 139, 34, 0.5) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(34, 139, 34, 0.5) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(107, 142, 35, 0.4) 0%, transparent 50%);
      background-size: 400px 400px;
      background-position: 0 0, 100px 100px, 200px 200px;
    "></div>

    <!-- Pokemon Header -->
    <div class="bg-red-600 text-white py-4 md:py-6 px-2 md:px-4 text-center rounded shadow-lg relative z-10">
      <!-- New Game Button -->
      <button
        @click="confirmReset"
        class="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white text-red-600 px-2 md:px-4 py-2 rounded-full font-bold hover:bg-red-100 transition-all shadow-md cursor-pointer"
      >
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
          alt="Pokeball"
          class="w-6 h-6 md:w-8 md:h-8"
        />
        <span class="hidden md:inline">New Game</span>
      </button>

      <!-- Difficulty Menu Button -->
      <div class="absolute right-2 md:left-48 md:right-auto top-1/2 -translate-y-1/2">
        <button
          @click="showDifficultyMenu = !showDifficultyMenu"
          class="flex items-center gap-2 bg-white text-red-600 px-2 md:px-4 py-2 rounded-full font-bold hover:bg-red-100 transition-all shadow-md cursor-pointer"
        >
          <!-- Hamburger Icon -->
          <div class="flex flex-col gap-1">
            <div class="w-4 md:w-5 h-0.5 bg-red-600"></div>
            <div class="w-4 md:w-5 h-0.5 bg-red-600"></div>
            <div class="w-4 md:w-5 h-0.5 bg-red-600"></div>
          </div>
          <span class="hidden md:inline">Elegir dificultad</span>
        </button>

        <!-- Difficulty Dropdown Menu -->
        <div
          v-if="showDifficultyMenu"
          class="absolute top-full mt-2 bg-white rounded-lg shadow-xl overflow-hidden z-10 min-w-max right-0 md:left-0 md:right-auto"
        >
          <button
            @click="confirmDifficultyChange('Easy')"
            class="w-full px-4 md:px-6 py-2 md:py-3 text-left text-green-700 hover:bg-green-100 font-semibold cursor-pointer transition-colors flex items-center gap-2 text-sm md:text-base"
          >
            <span class="text-xl md:text-2xl">😊</span>
            <span>Easy (4 opciones)</span>
          </button>
          <button
            @click="confirmDifficultyChange('Normal')"
            class="w-full px-4 md:px-6 py-2 md:py-3 text-left text-yellow-700 hover:bg-yellow-100 font-semibold cursor-pointer transition-colors flex items-center gap-2 text-sm md:text-base"
          >
            <span class="text-xl md:text-2xl">😐</span>
            <span>Normal (6 opciones)</span>
          </button>
          <button
            @click="confirmDifficultyChange('Hard')"
            class="w-full px-4 md:px-6 py-2 md:py-3 text-left text-red-700 hover:bg-red-100 font-semibold cursor-pointer transition-colors flex items-center gap-2 text-sm md:text-base"
          >
            <span class="text-xl md:text-2xl">😰</span>
            <span>Hard (8 opciones)</span>
          </button>
          <button
            @click="confirmDifficultyChange('Extreme')"
            class="w-full px-4 md:px-6 py-2 md:py-3 text-left text-purple-700 hover:bg-purple-100 font-semibold cursor-pointer transition-colors flex items-center gap-2 text-sm md:text-base"
          >
            <span class="text-xl md:text-2xl">⚡</span>
            <span>Extreme (Input)</span>
          </button>
        </div>
      </div>

      <h1 class="text-xl md:text-4xl font-black tracking-wider px-12 md:px-0" style="font-family: 'Arial Black', 'Arial Bold', sans-serif; text-shadow: 2px 2px 0px rgba(0,0,0,0.3), -1px -1px 0px #ffcb05;">
        ¿QUIÉN ES ESE POKÉMON?
      </h1>
    </div>

    <!-- Audio Control Button (Bottom Right) -->
    <div class="fixed bottom-4 md:bottom-8 right-4 md:right-8 z-40">
      <!-- Audio Settings Menu -->
      <div
        v-if="showAudioMenu"
        class="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-xl p-4 md:p-6 w-72 md:min-w-80"
      >
        <h3 class="text-base md:text-lg font-bold mb-3 md:mb-4 text-gray-800">Configuración de Audio</h3>

        <!-- Music Toggle -->
        <div class="flex items-center justify-between mb-3 md:mb-4">
          <span class="text-sm md:text-base text-gray-700 font-semibold">Música de fondo</span>
          <button
            @click="audioControls.toggleMusic()"
            :class="[
              'px-3 md:px-4 py-1 md:py-2 rounded-full font-bold transition-all cursor-pointer text-sm md:text-base',
              audioControls.isMusicMuted.value ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            ]"
          >
            {{ audioControls.isMusicMuted.value ? 'Silenciado' : 'Activo' }}
          </button>
        </div>

        <!-- Sounds Toggle -->
        <div class="flex items-center justify-between mb-3 md:mb-4">
          <span class="text-sm md:text-base text-gray-700 font-semibold">Sonidos del juego</span>
          <button
            @click="audioControls.toggleSounds()"
            :class="[
              'px-3 md:px-4 py-1 md:py-2 rounded-full font-bold transition-all cursor-pointer text-sm md:text-base',
              audioControls.areSoundsMuted.value ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            ]"
          >
            {{ audioControls.areSoundsMuted.value ? 'Silenciado' : 'Activo' }}
          </button>
        </div>

        <!-- Volume Control -->
        <div class="mb-2">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm md:text-base text-gray-700 font-semibold">Volumen</span>
            <span class="text-sm md:text-base text-gray-600 font-bold">{{ audioControls.volume.value }}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            v-model.number="audioControls.volume.value"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <button
        @click="showAudioMenu = !showAudioMenu"
        class="bg-blue-600 text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all cursor-pointer text-xl md:text-2xl"
      >
        🔊
      </button>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg p-6 md:p-8 max-w-md w-full text-center shadow-2xl">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">Estás por reiniciar y perderás tu puntaje</h2>
        <p class="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">¿Continuar?</p>
        <div class="flex gap-3 md:gap-4 justify-center flex-col sm:flex-row">
          <button
            @click="handleConfirm"
            class="bg-red-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-bold text-base md:text-lg hover:bg-red-700 transition-all shadow-lg cursor-pointer"
          >
            Continuar
          </button>
          <button
            @click="handleCancel"
            class="bg-gray-400 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-bold text-base md:text-lg hover:bg-gray-500 transition-all shadow-lg cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Game Over Modal -->
    <div
      v-if="isGameOver"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg p-6 md:p-8 max-w-md w-full text-center shadow-2xl">
        <h2 class="text-4xl md:text-5xl font-black text-red-600 mb-3 md:mb-4">GAME OVER</h2>
        <p class="text-xl md:text-2xl mb-4 md:mb-6">Tu puntuación final:</p>
        <div class="text-5xl md:text-6xl font-bold text-blue-600 mb-6 md:mb-8">🏆 {{ score }}</div>
        <button
          @click="resetGame"
          class="bg-red-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-lg md:text-xl hover:bg-red-700 transition-all shadow-lg cursor-pointer"
        >
          Nuevo Juego
        </button>
      </div>
    </div>

    <section v-if="isLoading|| randomPokemon?.id == null" class="flex flex-col justify-center items-center flex-1 relative z-20">
      <h2 class="text-2xl md:text-3xl font-bold mb-5 px-4 text-center">¡Bienvenido al juego Pokemon!</h2>
      <h3 class="animate-pulse text-lg md:text-xl">Cargando...</h3>
    </section>

    <section v-else class="flex flex-col justify-center items-center flex-1 px-4 overflow-y-auto relative z-20">
      <!-- Difficulty Badge -->
      <div class="mb-3 md:mb-4 px-3 md:px-4 py-1 md:py-2 rounded-lg font-bold text-sm md:text-base" :class="{
        'bg-green-200 text-green-800': difficulty === 'Easy',
        'bg-yellow-200 text-yellow-800': difficulty === 'Normal',
        'bg-red-200 text-red-800': difficulty === 'Hard',
        'bg-purple-200 text-purple-800': difficulty === 'Extreme'
      }">
        {{ difficulty }} - Ronda {{ roundsPlayed }}
      </div>

      <!-- Score and Lives Display -->
      <div class="mb-3 md:mb-4 flex gap-2 md:gap-4 items-center flex-wrap justify-center">
        <div class="px-3 md:px-4 py-1 md:py-2 bg-blue-100 text-blue-800 rounded-lg font-bold text-sm md:text-lg flex items-center gap-2">
          🏆 Puntuación: {{ score }}
          <span v-if="difficulty === 'Extreme' && correctAnswerStreak >= 2" class="text-lg md:text-xl">🔥</span>
        </div>
        <div class="px-3 md:px-4 py-1 md:py-2 bg-pink-100 text-pink-800 rounded-lg font-semibold flex items-center gap-2 text-sm md:text-base">
          <span class="font-bold">Vidas:</span>
          <div class="flex gap-1">
            <span v-for="(heart, index) in Array(lives).fill('❤️')" :key="index"
              :class="['text-xl md:text-2xl', { 'animate-shake': animatingHeartIndex === index }]">
              {{ heart }}
            </span>
          </div>
        </div>
      </div>

      <div class="h-16 md:h-20 mb-2 md:mb-0">
        <button v-if="gameStatus !== GameStatus.Playing && !isGameOver" @click="handleNextRound()" class="bg-green-500 shadow-md p-2 md:p-3 text-white rounded cursor-pointer hover:bg-green-700 w-32 md:w-40 text-center transition-all text-sm md:text-base">
          Siguiente
        </button>
      </div>

      <!-- Result Messages - Extreme mode only, above pokemon image -->
      <div v-if="difficulty === 'Extreme' && lastResult" class="w-full flex justify-center mt-4 mb-4">
        <div class="w-full max-w-md px-4">
          <p v-if="lastResult.type === 'ok'" class="text-2xl md:text-3xl font-bold text-green-600 text-center mb-2">
            ¡Correcto!
          </p>
          <p v-if="lastResult.type === 'almost'" class="text-2xl md:text-3xl font-bold text-orange-500 text-center mb-2">
            ¡¡ Casi !!
          </p>
          <p v-if="lastResult.type === 'wrong'" class="text-2xl md:text-3xl font-bold text-red-600 text-center mb-2">
            💔 Incorrecto
          </p>

          <p class="text-lg md:text-xl text-gray-700 text-center capitalize mb-2">
            {{ lastResult.correctName }}
          </p>

          <p v-if="lastResult.type === 'almost'" class="text-lg md:text-xl font-semibold text-orange-600 text-center">
            Puntos: {{ lastResult.points }}
          </p>
        </div>
      </div>

      <PokemonPicture :pokemon-id="randomPokemon?.id" :show-pokemon="gameStatus !== GameStatus.Playing"/>

      <!-- If Extreme difficulty, show a name input instead of option buttons -->
      <template v-if="difficulty === 'Extreme'">
        <div class="w-full flex justify-center mt-4">
          <div class="w-full max-w-md px-4">
            <!-- Show input only when not displaying a result -->
            <input
              v-if="!lastResult"
              v-model="answer"
              @keydown.enter.prevent="submitName"
              :disabled="gameStatus === GameStatus.Playing ? false : true"
              placeholder="Escribe el nombre del Pokémon"
              class="w-full p-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 text-center text-sm md:text-base"
            />
            <p v-if="validationError" class="text-sm text-red-600 mt-2 text-center">{{ validationError }}</p>

            <!-- Show "Enviar" button only when not displaying a result -->
            <div v-if="!lastResult" class="flex justify-center mt-3">
              <button
                @click="submitName"
                class="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition-all"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <PokemonOptions
          :options="options"
          :block-selection="gameStatus !== GameStatus.Playing"
          :correct-answer="randomPokemon?.id"
          @selectedOption="onSelectedOption"
        />
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import PokemonPicture from '../components/PokemonPicture.vue';
import PokemonOptions from '../components/PokemonOptions.vue';
import { usePokemonGame } from '../composables/UsePokemonGame';
import { GameStatus } from '../interfaces';

const router = useRouter();

const showDifficultyMenu = ref(false);
const showConfirmModal = ref(false);
const showAudioMenu = ref(false);
const pendingAction = ref<(() => void) | null>(null);

const {
  randomPokemon,
  isLoading,
  gameStatus,
  pokemonOptions:options,
  checkanswer,
  checkAnswerByName,
  getNextRound,
  difficulty,
  roundsPlayed,
  lives,
  score,
  isGameOver,
  resetGame,
  setDifficulty,
  audioControls,
  correctAnswerStreak,
} = usePokemonGame();

const answer = ref('');
const validationError = ref('');
const lastResult = ref(null);
const animatingHeartIndex = ref<number | null>(null);

const handleNextRound = () => {
  lastResult.value = null;
  getNextRound();
}

const submitName = () => {
  validationError.value = '';
  lastResult.value = null;
  const trimmed = (answer.value || '').trim();
  if (!trimmed) {
    validationError.value = 'Ingresa un nombre válido';
    return;
  }
  // Only allow letters, numbers and spaces
  if (!/^[a-zA-Z0-9\s]+$/.test(trimmed)) {
    validationError.value = 'No se permiten caracteres especiales';
    return;
  }

  const res = checkAnswerByName(trimmed);
  if (res?.ok) {
    // clear input and prepare for reveal/next
    answer.value = '';
    validationError.value = '';
    lastResult.value = { type: 'ok', correctName: res.correctName };
  } else if (res?.almost) {
    answer.value = '';
    validationError.value = '';
    lastResult.value = { type: 'almost', points: res.pointsAwarded, correctName: res.correctName };
  } else if (res?.reason === 'invalid-chars') {
    validationError.value = 'No se permiten caracteres especiales';
    lastResult.value = null;
  } else {
    validationError.value = '';
    lastResult.value = { type: 'wrong', correctName: res?.correctName };
    // Trigger heart shake animation on wrong answer
    const heartIndexToRemove = lives.value; // Get current lives after decrement
    animatingHeartIndex.value = Math.max(0, heartIndexToRemove - 1);
    setTimeout(() => {
      animatingHeartIndex.value = null;
    }, 2000);
  }
}

const onSelectedOption = (id: number) => {
  checkanswer(id);
  showDifficultyMenu.value = false;
}

const confirmReset = () => {
  if (roundsPlayed.value >= 1 && !isGameOver.value) {
    pendingAction.value = () => router.push('/');
    showConfirmModal.value = true;
  } else {
    router.push('/');
  }
}

const confirmDifficultyChange = (newDifficulty: string) => {
  showDifficultyMenu.value = false;

  if (newDifficulty !== difficulty.value && roundsPlayed.value >= 2 && !isGameOver.value) {
    pendingAction.value = () => setDifficulty(newDifficulty);
    showConfirmModal.value = true;
  } else {
    setDifficulty(newDifficulty);
  }
}

const handleConfirm = () => {
  if (pendingAction.value) {
    pendingAction.value();
    pendingAction.value = null;
  }
  showConfirmModal.value = false;
}

const handleCancel = () => {
  pendingAction.value = null;
  showConfirmModal.value = false;
}
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.animate-shake {
  animation: shake 2s ease-in-out;
}
</style>
