import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-confirm-modal',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.css'],
})
export class ConfirmModalComponent implements OnInit {

    public title: string = null;
    public content: string = null;

    constructor(private activeModal: NgbActiveModal) { }

    ngOnInit() {

    }

    setContent(content: string) {
        this.content = content;
    }

    setTitle(title: string) {
        this.title = title;
    }


    onClose(result: boolean) {
        this.activeModal.close(result);
	}
}
