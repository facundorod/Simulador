import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

    @Input() errors: any = null;
    @Input() key: string = null;

    ngOnInit() {

    }

    /**
     * Verify if the key set as param is correct to display errors
     */
    public isDisplayErrors() {
        if (this.key && this.errors) {
            let existKey = false;
            this.errors.forEach((error: any) => {
                if (error[this.key] !== undefined) {
                    existKey = true;
                }
            });
            return (existKey);
        } else {
            return (this.errors !== null);
        }
    }
}
