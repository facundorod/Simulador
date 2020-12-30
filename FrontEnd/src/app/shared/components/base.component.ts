import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, AbstractControl } from "@angular/forms";
import { OnInit } from "@angular/core";

export abstract class BaseComponent implements OnInit {
    formGroup: FormGroup = null;
    submitForm = false;
    message: {
        type: string; // 'error', 'success', 'warning'
        value: string; // message
    } = null;

    errors: Array<any> = null;

    private loading = false;

    constructor() {}

    ngOnInit() {}

    /**
     * Return true if error message should be displayed
     * @param controlName
     */
    public isDisplayError(controlName: string) {
        return (
            this.submitForm &&
            this.formGroup.controls[controlName] &&
            !this.formGroup.controls[controlName].valid
        );
    }

    /**
     * Return true if field is required
     */
    public isRequiredField(controlName: string) {
        if (this.formGroup.controls[controlName]) {
            const formControl = this.formGroup.controls[controlName];
            if (formControl.validator) {
                const validator = formControl.validator({} as AbstractControl);
                if (validator && validator.required) {
                    return true;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Save loading form
     * @param value
     */
    public setLoading(value: boolean) {
        this.loading = value;
    }

    /**
     * Return is loading form
     */
    public isLoading() {
        return this.loading;
    }

    /**
     * Save message
     * @param value
     */
    public setMessage(type: string, value: string) {
        this.message = {
            type: type,
            value: value,
        };
    }

    /**
     * Clean message
     */
    public cleanMessage() {
        this.message = null;
    }

    /**
     * Set list of errors
     * @param errors
     */
    public setErrors(errors: any) {
        this.errors = errors;
    }

    /**
     * Return list of errors
     */
    public getErrors() {
        const errors = this.errors ? this.errors : [];

        if (this.formGroup.controls) {
            Object.keys(this.formGroup.controls).forEach((key) => {
                if (this.formGroup.controls[key].errors !== null) {
                    const item = {};
                    item[key] = "Error (TBD)";
                    if (this.formGroup.controls[key].errors.required) {
                        item[key] = "Este campo es requerido";
                        errors.push(item);
                    } else if (this.formGroup.controls[key].errors.url) {
                        item[key] = "No es una URL válida";
                        errors.push(item);
                    } else {
                        errors.push(item);
                    }
                }
            });
        }

        return errors;
    }

    /**
     * Set submitForm value
     * @param submitForm
     */
    public setSubmitForm(submitForm: boolean) {
        this.submitForm = submitForm;
    }

    /**
     * Return if submitForm is true
     */
    public isSubmitForm() {
        return this.submitForm;
    }

    /**
     * Update route params
     * @param activatedRoute
     * @param router
     * @param params
     */
    public updateRouteParams(router: Router, params: any) {
        router.navigate([], { queryParams: params });
    }

    /**
     * Read params from activated route
     * @param activatedRoute
     * @param params
     */
    public readFromRouteParams(activatedRoute: ActivatedRoute, params: any) {
        if (params) {
            const routeParams = activatedRoute.snapshot.queryParams;

            for (const key in routeParams) {
                if (params[key] !== undefined) {
                    if (routeParams[key] === "true") params[key] = true;
                    else if (routeParams[key] === "false") params[key] = false;
                    else params[key] = routeParams[key];
                }
            }
        }

        return params;
    }
}
