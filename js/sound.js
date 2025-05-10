// Sound Management
class SoundManager {
    constructor() {
        this.sounds = {
            water: new Audio('assets/sounds/water-ambient.mp3'),
            nature: new Audio('assets/sounds/nature-ambient.mp3'),
            spa: new Audio('assets/sounds/spa-ambient.mp3')
        };
        this.currentSound = null;
        this.isPlaying = false;
        this.volume = localStorage.getItem('soundVolume') || 0.5;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setVolume(this.volume);
    }

    setupEventListeners() {
        const soundToggle = document.querySelector('.sound-toggle');
        const soundMenu = document.querySelector('.sound-menu');
        const volumeSlider = document.querySelector('.volume-slider');

        if (soundToggle) {
            soundToggle.addEventListener('click', () => this.toggleSound());
        }

        if (soundMenu) {
            // Handle sound selection
            soundMenu.addEventListener('click', (e) => {
                const soundOption = e.target.closest('.sound-option');
                if (soundOption) {
                    const soundType = soundOption.dataset.sound;
                    this.playSound(soundType);
                }
            });
        }

        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.setVolume(e.target.value);
            });
        }

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAll();
            } else if (this.isPlaying) {
                this.resumeCurrent();
            }
        });
    }

    playSound(soundType) {
        // Stop current sound if playing
        this.stopCurrent();

        // Start new sound
        const sound = this.sounds[soundType];
        if (sound) {
            sound.loop = true;
            sound.play().catch(error => {
                console.error('Error playing sound:', error);
            });
            this.currentSound = soundType;
            this.isPlaying = true;
            this.updateSoundUI(soundType);
        }
    }

    stopCurrent() {
        if (this.currentSound) {
            this.sounds[this.currentSound].pause();
            this.sounds[this.currentSound].currentTime = 0;
        }
    }

    pauseAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
        });
    }

    resumeCurrent() {
        if (this.currentSound && this.isPlaying) {
            this.sounds[this.currentSound].play().catch(error => {
                console.error('Error resuming sound:', error);
            });
        }
    }

    toggleSound() {
        if (this.isPlaying) {
            this.stopCurrent();
            this.isPlaying = false;
        } else if (this.currentSound) {
            this.resumeCurrent();
            this.isPlaying = true;
        } else {
            // Default to water sound if no sound is selected
            this.playSound('water');
        }
        this.updateSoundUI();
    }

    setVolume(value) {
        this.volume = value;
        Object.values(this.sounds).forEach(sound => {
            sound.volume = value;
        });
        localStorage.setItem('soundVolume', value);
        this.updateVolumeUI();
    }

    updateSoundUI(soundType = null) {
        const soundToggle = document.querySelector('.sound-toggle');
        const soundMenu = document.querySelector('.sound-menu');

        if (soundToggle) {
            const icon = soundToggle.querySelector('i');
            if (icon) {
                icon.className = this.isPlaying ? 'fas fa-volume-up' : 'fas fa-volume-mute';
            }
        }

        if (soundMenu) {
            // Update active state of sound options
            const options = soundMenu.querySelectorAll('.sound-option');
            options.forEach(option => {
                if (option.dataset.sound === soundType) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
        }
    }

    updateVolumeUI() {
        const volumeSlider = document.querySelector('.volume-slider');
        if (volumeSlider) {
            volumeSlider.value = this.volume;
        }
    }
}

// Initialize sound manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SoundManager();
}); 