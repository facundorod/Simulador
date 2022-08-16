import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';

@Component({
    selector: 'app-manual',
    templateUrl: './manual.component.html',
    styleUrls: ['./manual.component.css']
})
export class ManualComponent implements OnInit {
    private source: string = environment.userManual;
    constructor() { }

    ngOnInit(): void {
    }

    public getSource(): string {
        return this.source;
    }


}
