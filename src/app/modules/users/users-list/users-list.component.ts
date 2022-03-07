import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '@app/services/auth.service';
import { UserI } from '@app/shared/models/userI';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { ConfirmModalComponent } from "../../../shared/modals/confirm/confirm-modal.component";
import { EditUserComponent } from '../modals/edit-user/edit-user.component';

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
    public formGroup: FormGroup;
    private loading: boolean = true;
    public queryOptions = {
        pageSize: 5,
        page: 1,
    };
    public paginatorData: {
        totalPages: number;
        itemsPerPage: number;
    };
    public users: UserI[] = [];

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private userSvc: UserService,
        private toast: ToastrService,
        private modal: NgbModal) { }

    ngOnInit(): void {
        this.initFormGroup();
        this.loadData();
    }

    public loadData(q: string = null): void {
        this.userSvc.list({
            page: this.queryOptions.page,
            pageSize: this.queryOptions.pageSize,
            q: q ? q : this.formGroup.value.q,
        }).subscribe((users: any) => {
            if (users) {
                this.users = users.data;
                this.paginatorData = {
                    totalPages: users.total,
                    itemsPerPage: users.per_page,
                };
            }
            this.loading = false;
        }, (error: Error) => {
            this.loading = false;
            console.error(error);
        })
    }

    public onInviteuser(): void {
        const modal = this.modal.open(EditUserComponent);
        modal.componentInstance.setNewUser(true);
        modal.result.then((result: UserI) => {
            if (result) {
                this.userSvc.
                    createUser(result)
                    .subscribe(
                        () => {
                            this.toast.toastrConfig.timeOut = 1000;
                            this.toast.toastrConfig.positionClass =
                                "toast-bottom-full-width";
                            this.toast.success("The user has been invited");
                            this.loadData();
                        },
                        (err: any) => {
                            console.error(err);
                        }
                    );
            }
        });
    }

    public isUserAdmin(): boolean {
        return this.authService.isAdmin();
    }

    public onSearch(): void {
        this.queryOptions.page = 1;
        this.loading = true;
        this.loadData();
    }


    private initFormGroup() {
        this.formGroup = this.fb.group({
            q: [""],
        });
        this.formGroup.get("q").valueChanges.subscribe((newValue) => {
            if (!newValue) this.onClearSearch();
            this.loading = true;
            this.loadData(newValue);
        });
    }

    public onClearSearch(): void {
        this.queryOptions.page = 1;
        this.initFormGroup();
        this.loadData();
    }

    public isLoading(): boolean {
        return this.loading;
    }

    public onEdit(index: number): void {
        const modal = this.modal.open(EditUserComponent);
        const user: UserI = this.users[index];
        if (user) {
            modal.componentInstance.setUser(user);
            modal.result.then((result: UserI) => {
                if (result) {
                    this.userSvc
                        .updateUser(this.users[index].id_user, result)
                        .subscribe(
                            () => {
                                this.toast.toastrConfig.timeOut = 1000;
                                this.toast.toastrConfig.positionClass =
                                    "toast-bottom-full-width";
                                this.toast.success("The user has been deleted");
                                this.loadData();
                            },
                            (err: any) => {
                                console.error(err);
                            }
                        );
                }
            });
        }
    }

    public onDelete(index: number) {
        const modal = this.modal.open(ConfirmModalComponent);

        modal.componentInstance.setTitle(
            `You will delete the user ${this.users[index].surname}, ${this.users[index].name}`
        );
        modal.componentInstance.setContent("Are you sure?");
        modal.result.then((result) => {
            if (result) {
                this.userSvc
                    .delete(this.users[index].id_user)
                    .subscribe(
                        () => {
                            this.toast.toastrConfig.timeOut = 1000;
                            this.toast.toastrConfig.positionClass =
                                "toast-bottom-full-width";
                            this.toast.success("The user has been deleted");
                            this.loadData();
                        },
                        (err: any) => {
                            console.error(err);
                        }
                    );
            }
        });
    }


    public onPageChange(): void {
        this.loading = true;
        this.loadData();

    }
}
