import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-audio',
    templateUrl: './audio.component.html',
    styleUrls: ['./audio.component.css']
})
export class AudioComponent implements OnInit {
    public src: string = '/assets/sounds/monitor.mp3';
    @Input() play: boolean = false;
    constructor() { }

    ngOnInit(): void {
    }


}
