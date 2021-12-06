import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserI } from "@app/shared/models/userI";
import { ToastrService } from "ngx-toastr";
import { UserService } from "../services/user.service";

@Component({
    selector: "app-my-profile",
    templateUrl: "./my-profile.component.html",
    styleUrls: ["./my-profile.component.css"],
})
export class MyProfileComponent implements OnInit {
    @ViewChild("pwd") password: ElementRef;
    private formGroup: FormGroup;
    private user: UserI;

    constructor(
        private userService: UserService,
        private fb: FormBuilder,
        private toast: ToastrService
    ) {
        this.loadUser();
        this.initFormGroup();
    }

    private loadUser(): void {
        const authUser = JSON.parse(localStorage.getItem("authToken"));
        this.user = {
            email: authUser.user.email,
            institution: authUser.user.institution,
            name: authUser.user.name,
            surname: authUser.user.surname,
            id_user: authUser.user.id_user,
        };
    }

    ngOnInit(): void {}

    public toogleInput(): void {
        const type = this.password.nativeElement.type;
        const newType = type === "password" ? "text" : "password";
        this.password.nativeElement.type = newType;
    }

    public getForm(): FormGroup {
        return this.formGroup;
    }

    private initFormGroup(): void {
        this.formGroup = this.fb.group({
            name: [this.user.name ? this.user.name : "", Validators.required],
            surname: [
                this.user.surname ? this.user.surname : "",
                Validators.required,
            ],
            password: [this.user.password ? this.user.password : null],
            institution: [this.user.institution ? this.user.institution : null],
            email: [
                this.user.email ? this.user.email : "",
                Validators.required,
            ],
        });
    }

    public onSubmit(): void {
        this.userService.updateUser(this.user).subscribe(
            () => {
                this.toast.toastrConfig.timeOut = 1000;
                this.toast.toastrConfig.positionClass =
                    "toast-bottom-full-width";
                this.toast.success("User updated successfully");
                this.loadUser();
            },
            (error: Error) => {
                console.error(error);
            }
        );
    }
}
