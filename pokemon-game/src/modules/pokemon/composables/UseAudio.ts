import { ref, watch } from 'vue';

export const useAudio = () => {
  const isMusicMuted = ref(false);
  const areSoundsMuted = ref(false);
  const volume = ref(50);

  // Background music - Pokemon Center theme
  const musicUrl = 'https://vgmsite.com/soundtracks/pokemon-gameboy-sound-complete-collection/qzrtqugage/1-02%20Pokemon%20Center.mp3';
  let backgroundMusic: HTMLAudioElement | null = null;

  // Correct answer sounds - Victory/Success sounds
  const correctSounds = [
    'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3', // Success bell
    'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', // Achievement bell
    'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Correct answer
    'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', // Positive notification
  ];

  // Wrong answer sounds - Error/Buzzer sounds
  const wrongSounds = [
    'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3', // Error buzz
    'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3', // Wrong answer
    'https://assets.mixkit.co/active_storage/sfx/1876/1876-preview.mp3', // Game error
    'https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3', // Negative beep
  ];

  const initMusic = () => {
    if (musicUrl && !backgroundMusic) {
      backgroundMusic = new Audio(musicUrl);
      backgroundMusic.loop = true;
      backgroundMusic.volume = volume.value / 100;
    }
  };

  // Watch volume changes
  watch(volume, (newVolume) => {
    if (backgroundMusic) {
      backgroundMusic.volume = newVolume / 100;
    }
  });

  const playBackgroundMusic = () => {
    initMusic();
    if (!isMusicMuted.value && backgroundMusic) {
      backgroundMusic.play().catch(err => console.log('Music play failed:', err));
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

  const playRandomSound = (soundArray: string[]) => {
    if (areSoundsMuted.value || soundArray.length === 0 || soundArray[0] === '') return;

    const randomIndex = Math.floor(Math.random() * soundArray.length);
    const audio = new Audio(soundArray[randomIndex]);
    audio.volume = volume.value / 100;
    audio.play().catch(err => console.log('Sound play failed:', err));
  };

  const playCorrectSound = () => {
    playRandomSound(correctSounds);
  };

  const playWrongSound = () => {
    playRandomSound(wrongSounds);
  };

  return {
    isMusicMuted,
    areSoundsMuted,
    volume,
    playBackgroundMusic,
    stopBackgroundMusic,
    toggleMusic,
    toggleSounds,
    playCorrectSound,
    playWrongSound,
  };
};




