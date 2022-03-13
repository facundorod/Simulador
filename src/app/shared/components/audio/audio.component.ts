import {
    AfterViewInit,
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';

@Component({
    selector: 'app-audio',
    templateUrl: './audio.component.html',
    styleUrls: ['./audio.component.css'],
})
export class AudioComponent implements OnInit, OnChanges {
    @Input() src: string;
    @Input() play = false;
    @ViewChild('audio') audio: HTMLAudioElement;
    @Input() playRate = 1.0;
    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        const audio = document.querySelector('audio');
        if (audio && changes.playRate) {
            audio.playbackRate = changes.playRate.currentValue;
        }
    }

    ngOnInit(): void {}
}
