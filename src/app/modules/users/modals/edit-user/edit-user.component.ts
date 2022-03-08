import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleI } from '@app/shared/models/roleI';
import { UserI } from '@app/shared/models/userI';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
    private formGroup: FormGroup;
    private loading: boolean = true;
    private user: UserI;
    public newUser: boolean = false;
    private roles: RoleI[];
    private roleSettings: IDropdownSettings;
    public rolesSelected: RoleI[] = [];
    constructor(private fb: FormBuilder, private userService: UserService, private activeModal: NgbActiveModal) { }

    ngOnInit(): void {
        this.loadData();
        if (this.user && this.user.roles)
            this.rolesSelected = this.user.roles;
        this.roleSettings = {
            singleSelection: false,
            idField: 'id_role',
            textField: 'name',
            itemsShowLimit: 4,
            allowSearchFilter: false,
            defaultOpen: false
        }
    }
    public loadData(): void {
        this.userService.getRoles().subscribe((roles: RoleI[]) => {
            if (roles) this.roles = roles;
            this.loading = false;
            this.initFormGroup();
        },
            (error: Error) => {
                console.error(error);
                this.loading = false;
            })
    }

    public setUser(user: UserI): void {
        this.user = user;

    }

    public setNewUser(value: boolean): void {
        this.newUser = value;
    }

    public getFormGroup(): FormGroup {
        return this.formGroup;
    }

    public onSubmit(): void {
        this.loading = true;
        const userEdited: UserI = this.formGroup.value;
        if (!this.newUser) delete userEdited.password;
        this.activeModal.close(userEdited);
    }

    public onSelectRole(role: RoleI) {

    }

    public onDeselectRole(role: RoleI) {
    }

    public isLoading(): boolean {
        return this.loading;
    }

    public onCancel(): void {
        this.activeModal.close(false);
    }

    public initFormGroup(): void {
        this.formGroup = this.fb.group({
            name: [
                this.user ? this.user.name : "",
                Validators.required,
            ],
            surname: [
                this.user ? this.user.surname : '',
                Validators.required
            ],
            email: [
                this.user ? this.user.email : '',
                Validators.required
            ],
            password: [
                '',
            ],
            institution: [
                this.user && this.user.institution ? this.user.institution : '',
            ],
            roles: [
                this.rolesSelected ? this.rolesSelected : []
            ]
        })
    }

    public getRoles(): RoleI[] {
        return this.roles;
    }

    public getRoleSettings() {
        return this.roleSettings;
    }

}
