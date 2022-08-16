import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
    @ViewChild('pwd') newPassword: ElementRef;
    @ViewChild('pwd2') confirmPassword: ElementRef;

    private formGroup: FormGroup;
    private validPwd = false;
    constructor(private fb: FormBuilder, private activeModal: NgbActiveModal) {}

    ngOnInit(): void {
        this.initForm();
    }

    private initForm(): void {
        this.formGroup = this.fb.group({
            newPassword: ['', Validators.required],
            confirmPassword: ['', Validators.required],
        });
        this.formGroup
            .get('confirmPassword')
            .valueChanges.subscribe((value: string) => {
                const newPassword = this.formGroup.get('newPassword').value;
                if (value && newPassword && newPassword === value) {
                    this.validPwd = true;
                }
                else { this.validPwd = false; }
            });
        this.formGroup
            .get('newPassword')
            .valueChanges.subscribe((value: string) => {
                const confirmPassword =
                    this.formGroup.get('confirmPassword').value;
                if (value && confirmPassword && confirmPassword === value) {
                    this.validPwd = true;
                }
                else { this.validPwd = false; }
            });
    }

    public onSubmit(): void {
        if (this.formGroup.valid) {
            this.activeModal.close(this.formGroup.get('newPassword').value);
        }
    }

    public onClose(): void {
        this.activeModal.close(null);
    }

    public getForm(): FormGroup {
        return this.formGroup;
    }

    public isValidPwd(): boolean {
        return this.validPwd;
    }

    public toogleInput(): void {
        const type = this.newPassword.nativeElement.type;
        const newType = type === 'password' ? 'text' : 'password';
        this.newPassword.nativeElement.type = newType;
    }

    public toogleInput2(): void {
        const type = this.confirmPassword.nativeElement.type;
        const newType = type === 'password' ? 'text' : 'password';
        this.confirmPassword.nativeElement.type = newType;
    }
}
