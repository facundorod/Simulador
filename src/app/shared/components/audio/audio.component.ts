import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

@Component({
    selector: 'app-audio',
    templateUrl: './audio.component.html',
    styleUrls: ['./audio.component.css']
})
export class AudioComponent implements OnInit, OnChanges {
    @Input() src: string;
    @Input() play: boolean = false;
    @ViewChild('audio') audio: HTMLAudioElement;
    @Input() playRate: number = 1.0;
    constructor() {
        console.log("REPRODUCING AUDIO");
        console.log("PLAY RATE", this.playRate);
    }


    ngOnChanges(changes: SimpleChanges): void {
        const audio = document.querySelector('audio');
        if (audio && changes.playRate) {
            audio.playbackRate = changes.playRate.currentValue;
            console.log("CHANGING PLAY RATE AUDIO");
            console.log("PLAY RATE", this.playRate);
        }
    }

    ngOnInit(): void {
    }



}
