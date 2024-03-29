import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '@app/services/auth.service';
import { ConfirmModalComponent } from '@app/shared/modals/confirm/confirm-modal.component';
import { PhysiologicalParamaterI } from '@app/shared/models/physiologicalParamaterI';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NewParameterComponent } from '../../modals/new-parameter/new-parameter.component';
import { ParametersService } from '../../services/parameters.service';

@Component({
    selector: 'app-parameters',
    templateUrl: './parameters.component.html',
    styleUrls: ['./parameters.component.css'],
})
export class ParametersComponent implements OnInit {
    private parameters: PhysiologicalParamaterI[] = [];
    private loading = true;
    private formGroup: FormGroup;
    constructor(
        private parameterSvc: ParametersService,
        private authService: AuthService,
        private fb: FormBuilder,
        private toast: ToastrService,
        private modal: NgbModal
    ) { }

    ngOnInit(): void {
        this.initFormGroup();
        this.loadData();
    }

    private initFormGroup(): void {
        this.formGroup = this.fb.group({
            q: [''],
        });

        this.formGroup.get('q').valueChanges.subscribe((newValue) => {
            this.loading = true;
            this.loadData(newValue);
        });
    }

    private loadData(q: string = null): void {
        this.loading = true;
        this.parameterSvc
            .findAll({ q: q ? q : this.formGroup.get('q').value })
            .subscribe(
                (value: PhysiologicalParamaterI[]) => {
                    if (value) { this.parameters = value; }
                    this.loading = false;
                },
                (error: Error) => {
                    console.error(error);
                }
            );
    }

    public getFormGroup(): FormGroup {
        return this.formGroup;
    }

    public isLoading(): boolean {
        return this.loading;
    }

    public onAddParameter(): void {
        const modal: NgbModalRef = this.modal.open(NewParameterComponent, {size: 'lg', windowClass: 'modal-small'});
        modal.result
            .then((value: PhysiologicalParamaterI) => {
                if (value) {
                    this.parameterSvc.createParameter(value).subscribe(
                        () => {
                            this.toast.toastrConfig.timeOut = 1000;
                            this.toast.toastrConfig.positionClass =
                                'toast-bottom-full-width';
                            this.toast.success('Parameter added successfully');
                            this.loadData();
                        },
                        (error: Error) => {
                            console.error(error);
                        }
                    );
                }
            })
            .catch((error: Error) => {
                console.error(error);
            });
    }

    public onEditParameter(index: number) {
        const modal: NgbModalRef = this.modal.open(NewParameterComponent, {size: 'lg', windowClass: 'modal-small'});
        modal.componentInstance.setParameter(this.parameters[index]);
        const id: number = this.parameters[index].id_pp;
        modal.result
            .then((value: PhysiologicalParamaterI) => {
                if (value) {
                    this.parameterSvc.updateParameter(id, value).subscribe(
                        () => {
                            this.toast.toastrConfig.timeOut = 1000;
                            this.toast.toastrConfig.positionClass =
                                'toast-bottom-full-width';
                            this.toast.success(
                                'Parameter updated successfully'
                            );
                            this.loadData();
                        },
                        (error: Error) => {
                            console.error(error);
                        }
                    );
                }
            })
            .catch((error: Error) => {
                console.error(error);
            });
    }

    public clearSearch(): void {
        this.formGroup.get('q').reset();
        this.loading = true;
        this.loadData();
    }

    public getParameters(): PhysiologicalParamaterI[] {
        return this.parameters;
    }

    public onDeleteParameter(index: number) {
        const id: number = this.parameters[index].id_pp;
        if (id) {
            const modal = this.modal.open(ConfirmModalComponent, {size: 'lg', windowClass: 'modal-small'});
            modal.componentInstance.setTitle(
                `You will delete the scenario ${this.parameters[index].name}`
            );
            modal.componentInstance.setContent('Are you sure?');
            modal.result.then((result) => {
                if (result) {
                    this.loading = true;
                    this.parameterSvc.deleteParameter(id).subscribe(
                        () => {
                            this.toast.toastrConfig.timeOut = 1000;
                            this.toast.toastrConfig.positionClass =
                                'toast-bottom-full-width';
                            this.toast.success(
                                'Parameter deleted successfully'
                            );
                            this.loading = true;
                            this.loadData();
                        },
                        (error: Error) => {
                            console.error(error);
                        }
                    );
                }
            });
        }
    }

    public isUserAdmin(): boolean {
        return this.authService.isAdmin();
    }
}
