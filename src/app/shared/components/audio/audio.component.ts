import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-audio',
    templateUrl: './audio.component.html',
    styleUrls: ['./audio.component.css']
})
export class AudioComponent implements OnInit, AfterViewInit {
    public src: string = '/assets/sounds/monitor.mp3';
    @Input() play: boolean = false;

    @Input() playRate: number = 1.0;
    constructor() { }


    ngAfterViewInit(): void {
        const audio: HTMLAudioElement | any = document.getElementById('audio');
        if (audio)
            audio.playbackRate = this.playRate;
    }



    ngOnInit(): void {
    }



}
