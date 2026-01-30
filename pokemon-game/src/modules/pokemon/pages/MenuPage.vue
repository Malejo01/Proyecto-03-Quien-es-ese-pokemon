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

    <!-- Header -->
    <div class="bg-red-600 text-white pt-6 pb-7 md:py-6 px-2 md:px-4 text-center rounded-b-3xl shadow-2xl relative z-10">
      <button
        class="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white text-red-600 px-3 md:px-4 py-2 rounded-full font-bold transition-all shadow-md"
      >
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
          alt="Pokeball"
          class="inline-block shrink-0 w-5 h-5 md:w-8 md:h-8 object-contain"
        />
      </button>
      <h1 class="text-3xl md:text-4xl font-black tracking-wider px-4 md:px-0 text-center" style="
        font-family: 'Arial Black', 'Arial Bold', sans-serif;
        color: #FFD700;
        text-shadow:
          4px 4px 0px #1a1a2e,
          -2px -2px 0px rgba(255, 203, 5, 0.5),
          3px 3px 8px rgba(0, 0, 0, 0.4);
        letter-spacing: 3px;
      ">
        ¿QUIÉN ES ESE POKÉMON?
      </h1>
      <button
        class="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white text-red-600 px-3 md:px-4 py-2 rounded-full font-bold transition-all shadow-md"
      >
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
          alt="Pokeball"
          class="inline-block shrink-0 w-5 h-5 md:w-8 md:h-8 object-contain"
        />
      </button>
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

    <!-- Main Content - Centered Difficulty Selection -->
    <div class="flex flex-col justify-center items-center flex-1 px-0 pt-5 md:pt-8 relative z-10 overflow-y-auto h-full w-full">

      <!-- Difficulty Options -->
      <div class="w-full max-w-xl grid grid-cols-1 gap-3 md:gap-4">
        <!-- Easy - Bulbasaur -->
        <button
          @click="selectDifficulty('Easy')"
          class="w-full px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-5 text-white hover:scale-105 bg-gradient-to-r from-green-500 to-green-600 font-bold cursor-pointer transition-all flex flex-col md:flex-row items-center md:items-center gap-3 md:gap-4 text-center rounded-2xl shadow-xl border-4 border-green-700 hover:shadow-2xl"
        >
          <span class="text-3xl sm:text-4xl md:text-5xl">🌱</span>
          <div class="w-full">
            <div class="font-black text-lg sm:text-xl md:text-2xl drop-shadow-lg">Facil</div>
            <div class="text-sm md:text-base text-green-100">4 opciones • 2 pts</div>
          </div>
        </button>

        <!-- Normal - Pokéball -->
        <button
          @click="selectDifficulty('Normal')"
          class="w-full px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-5 text-white hover:scale-105 bg-gradient-to-r from-yellow-500 to-yellow-600 font-bold cursor-pointer transition-all flex flex-col md:flex-row items-center md:items-center gap-3 md:gap-4 text-center rounded-2xl shadow-xl border-4 border-yellow-700 hover:shadow-2xl"
        >
          <span class="text-3xl sm:text-4xl md:text-5xl">⚡</span>
          <div class="w-full">
            <div class="font-black text-lg sm:text-xl md:text-2xl drop-shadow-lg">Normal</div>
            <div class="text-sm md:text-base text-yellow-100">6 opciones • 3 pts</div>
          </div>
        </button>

        <!-- Hard - Charizard/Fire -->
        <button
          @click="selectDifficulty('Hard')"
          class="w-full px-4 md:px-6 py-3 md:py-5 text-white hover:scale-105 bg-gradient-to-r from-red-500 to-red-600 font-bold cursor-pointer transition-all flex flex-col md:flex-row items-center md:items-center gap-3 md:gap-4 text-center rounded-2xl shadow-xl border-4 border-red-700 hover:shadow-2xl"
        >
          <span class="text-4xl md:text-5xl">🔥</span>
          <div class="w-full">
            <div class="font-black text-xl md:text-2xl drop-shadow-lg">Dificil</div>
            <div class="text-sm md:text-base text-red-100">8 opciones • 4 pts</div>
          </div>
        </button>

        <!-- Extreme - Smiling Devil -->
        <button
          @click="selectDifficulty('Extreme')"
          class="w-full px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-5 text-white hover:scale-105 bg-gradient-to-r from-purple-600 to-pink-600 font-bold cursor-pointer transition-all flex flex-col md:flex-row items-center md:items-center gap-3 md:gap-4 text-center rounded-2xl shadow-xl border-4 border-purple-800 hover:shadow-2xl"
        >
          <span class="text-3xl sm:text-4xl md:text-5xl animate-bounce">😈</span>
          <div class="w-full">
            <div class="font-black text-lg sm:text-xl md:text-2xl drop-shadow-lg">Extremo (Modo Jesy)</div>
            <div class="text-sm md:text-base text-purple-100">Escribe el nombre • 10 pts + streak</div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePokemonGame } from '../composables/UsePokemonGame';
import { useRouter } from 'vue-router';

const router = useRouter();
const showAudioMenu = ref(false);

const { setDifficulty, audioControls } = usePokemonGame();

const selectDifficulty = async (difficulty: string) => {
  await setDifficulty(difficulty);
  await router.push({ name: 'PokemonGame' });
};
</script>

<style scoped>
</style>
