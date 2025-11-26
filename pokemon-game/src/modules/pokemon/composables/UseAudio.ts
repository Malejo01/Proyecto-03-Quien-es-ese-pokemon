import { ref, watch } from 'vue';

export const useAudio = () => {
  const isMusicMuted = ref(false);
  const areSoundsMuted = ref(false);
  const volume = ref(50);
  const isAudioLoaded = ref(false);

  // Audio instances
  let backgroundMusic: HTMLAudioElement | null = null;
  let correctSound: HTMLAudioElement | null = null;
  let wrongSound: HTMLAudioElement | null = null;
  let gameOverSound: HTMLAudioElement | null = null;

  // Preload all audio files
  const preloadAllAudio = async (): Promise<void> => {
    const promises: Promise<void>[] = [];

    // Background music
    const bgPromise = new Promise<void>((resolve, reject) => {
      backgroundMusic = new Audio('/src/assets/audio/background/Raid-Entry.mp3');
      backgroundMusic.loop = true;
      backgroundMusic.volume = (volume.value / 100) * 0.3; // 30% of user volume
      backgroundMusic.addEventListener('canplaythrough', () => resolve(), { once: true });
      backgroundMusic.addEventListener('error', reject, { once: true });
      backgroundMusic.load();
    });
    promises.push(bgPromise);

    // Win sound
    const winPromise = new Promise<void>((resolve, reject) => {
      correctSound = new Audio('/src/assets/audio/win/win01.mp3');
      correctSound.volume = volume.value / 100;
      correctSound.addEventListener('canplaythrough', () => resolve(), { once: true });
      correctSound.addEventListener('error', reject, { once: true });
      correctSound.load();
    });
    promises.push(winPromise);

    // Lose sound
    const losePromise = new Promise<void>((resolve, reject) => {
      wrongSound = new Audio('/src/assets/audio/lose/incorrect.mp3');
      wrongSound.volume = volume.value / 100;
      wrongSound.addEventListener('canplaythrough', () => resolve(), { once: true });
      wrongSound.addEventListener('error', reject, { once: true });
      wrongSound.load();
    });
    promises.push(losePromise);

    // Game over sound
    const gameOverPromise = new Promise<void>((resolve, reject) => {
      gameOverSound = new Audio('/src/assets/audio/game-over/game-over04.mp3');
      gameOverSound.volume = (volume.value / 100) * 0.8;
      gameOverSound.addEventListener('canplaythrough', () => resolve(), { once: true });
      gameOverSound.addEventListener('error', reject, { once: true });
      gameOverSound.load();
    });
    promises.push(gameOverPromise);

    try {
      await Promise.all(promises);
      isAudioLoaded.value = true;
      console.log('All audio files loaded successfully');
    } catch (error) {
      console.error('Error loading audio files:', error);
      isAudioLoaded.value = true; // Continue game even if audio fails
    }
  };

  // Watch volume changes
  watch(volume, (newVolume) => {
    if (backgroundMusic) {
      backgroundMusic.volume = (newVolume / 100) * 0.3;
    }
    if (correctSound) {
      correctSound.volume = newVolume / 100;
    }
    if (wrongSound) {
      wrongSound.volume = newVolume / 100;
    }
    if (gameOverSound) {
      gameOverSound.volume = (newVolume / 100) * 0.8;
    }
  });

  const playBackgroundMusic = () => {
    if (!isMusicMuted.value && backgroundMusic) {
      backgroundMusic.play().catch((err) => console.log('Music play failed:', err));
    }
  };

  const stopBackgroundMusic = () => {
    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }
  };

  const toggleMusic = () => {
    isMusicMuted.value = !isMusicMuted.value;
    if (isMusicMuted.value && backgroundMusic) {
      backgroundMusic.pause();
    } else {
      playBackgroundMusic();
    }
  };

  const toggleSounds = () => {
    areSoundsMuted.value = !areSoundsMuted.value;
  };

  const playCorrectSound = () => {
    if (areSoundsMuted.value || !correctSound) return;
    correctSound.currentTime = 0;
    correctSound.play().catch((err) => console.log('Correct sound play failed:', err));
  };

  const playWrongSound = () => {
    if (areSoundsMuted.value || !wrongSound) return;
    wrongSound.currentTime = 0;
    wrongSound.play().catch((err) => console.log('Wrong sound play failed:', err));
  };

  const playGameOverSound = () => {
    stopBackgroundMusic();
    if (areSoundsMuted.value || !gameOverSound) return;
    gameOverSound.currentTime = 0;
    gameOverSound.play().catch((err) => console.log('Game over sound play failed:', err));
  };

  return {
    isMusicMuted,
    areSoundsMuted,
    volume,
    isAudioLoaded,
    preloadAllAudio,
    playBackgroundMusic,
    stopBackgroundMusic,
    toggleMusic,
    toggleSounds,
    playCorrectSound,
    playWrongSound,
    playGameOverSound,
  };
};
