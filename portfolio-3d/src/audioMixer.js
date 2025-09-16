import * as THREE from 'three';

export class AudioMixer{
    constructor(listner){
        this.audio = new THREE.Audio(listner);
        this.audioLoader = new THREE.AudioLoader();
        this.soundReady = false;
    }

    loadSoundFx(soundFile){
        this.audioLoader.load(soundFile , (buffer) => {
            this.audio.setBuffer(buffer);
            this.audio.setLoop(true);
            this.audio.setVolume(0.5);
            this.soundReady = true;
            this.audio.play();
        });
    }

    registerSFX(soundFile){
        this.audioLoader.load(soundFile , (buffer) => {
            this.audio.setBuffer(buffer);
            // this.audio.setLoop(true);
            this.audio.setVolume(0.5);
            this.soundReady = true;
        });
    }

    async playAudio(delay=0){
        this.audio.play(delay);
    }
}