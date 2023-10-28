import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { AudioPlayerService } from '@app/shared/services/audio-player.service';

@Component({
    selector: 'app-audio',
    templateUrl: './audio.component.html',
    styleUrls: ['./audio.component.css'],
})
export class AudioComponent implements OnInit, OnChanges {
    @Input() src: string;
    @Input() play = false;
    @Input() playRate: number = 1.0;
    @Input() loopSound: boolean = false;
    private audioPlayerService: AudioPlayerService;

    constructor() {
        this.audioPlayerService = new AudioPlayerService();
    }

    ngOnInit(): void {
        this.audioPlayerService.initSoundProvider(this.src, this.loopSound, this.loopSound, this.play);
    }

    public playSound(): void {
        this.audioPlayerService.playSound();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.play !== undefined && !changes.play.firstChange) {
            this.updateAudioState();
        }

    }

    private updateAudioState() {
        if (this.play) {
            this.audioPlayerService.playSound();
        } else {
            this.audioPlayerService.stopSound();
        }
    }
}



