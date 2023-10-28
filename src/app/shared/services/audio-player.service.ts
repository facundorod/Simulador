import { Injectable } from '@angular/core';
import { Howl, Howler } from 'howler';

@Injectable({
    providedIn: 'root'
})
export class AudioPlayerService {

    private sound: Howl;
    private intervalId: NodeJS.Timeout;
    private isPlaying: boolean;

    constructor() {
    }

    public stopSound(): void {
        clearInterval(this.intervalId);
        this.sound.stop();
    }

    public pauseSound(): void {
        clearInterval(this.intervalId);
        this.sound.pause();
        this.isPlaying = false;
    }

    public playSound(loop = true): void {
        if (!this.isPlaying || loop) {
            this.sound.play();
            this.isPlaying = true;
        }
    }

    public initSoundProvider(src: string, loop: boolean, autoplay: boolean, play: boolean = false): void {
        this.sound = new Howl({
            src,
            autoplay,
            loop,
        })
        this.sound.once('load', () => {
            if (play) {
                this.isPlaying = true;
                this.sound.play();
            }
        });
    }

}
