import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CurveValues } from "@app/shared/models/curveValues";
import { CurveValuesI } from "@app/shared/models/curveValuesI";
import { PhysiologicalParamaterI } from "@app/shared/models/physiologicalParamaterI";
import { SPPI } from "@app/shared/models/SPPI";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "app-parameters-create",
    templateUrl: "./parameters-create.component.html",
    styleUrls: ["./parameters-create.component.css"],
})
export class ParametersCreateComponent implements OnInit {
    private parameter: SPPI;
    private parameters: PhysiologicalParamaterI[];
    private loading: boolean = true;
    private fileContent: CurveValuesI[] = [];
    private formGroup: FormGroup;
    constructor(private fb: FormBuilder, private activeModal: NgbActiveModal) {}

    ngOnInit(): void {
        this.initFormGroup();
    }

    public setParameter(parameter: SPPI) {
        this.parameter = parameter;
    }

    public getParameter(): SPPI {
        return this.parameter;
    }

    public onSubmit(): void {
        this.parameter.curves = this.fileContent;
        debugger;
        this.activeModal.close(this.parameter);
    }

    public getFormGroup(): FormGroup {
        return this.formGroup;
    }

    public initFormGroup(): void {
        const physiologicalParameter: PhysiologicalParamaterI =
            this.parameter.animalParameters.physiologicalParameter;
        this.formGroup = this.fb.group({
            name: [
                {
                    value: physiologicalParameter.name
                        ? physiologicalParameter.name
                        : "",
                    disabled: true,
                },
                Validators.required,
            ],
            description: [
                {
                    value: physiologicalParameter.description
                        ? physiologicalParameter.description
                        : "",
                    disabled: true,
                },
                Validators.required,
            ],

            alert_low: [
                this.parameter.animalParameters.alert_low
                    ? this.parameter.animalParameters.alert_low
                    : 0,
            ],
            alert_high: [
                this.parameter.animalParameters.alert_high
                    ? this.parameter.animalParameters.alert_high
                    : 0,
            ],
            value: [this.parameter.value ? this.parameter.value : 0],
        });
        this.loading = false;
    }

    public onCancel(): void {
        this.activeModal.close(false);
    }

    public getParameters(): PhysiologicalParamaterI[] {
        return this.parameters;
    }

    public isLoading(): boolean {
        return this.loading;
    }

    public changeCurves() {
        return this.parameter.curves?.length > 0;
    }

    public onDeleteCurves() {
        this.parameter.curves = [];
    }

    public onFileChange(event: any): void {
        if (event.target.files && event.target.files.length) {
            const [file] = event.target.files;
            let reader = new FileReader();
            reader.readAsText(file);

            reader.onload = () => {
                let csvData = reader.result;
                let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
                const records = this.getCurvesFromCSV(csvRecordsArray);
                this.fileContent = records;
            };
            reader.onerror = function () {
                console.log("error is occured while reading file!");
            };
        }
    }

    public getCurvesFromCSV(csvRecordsArray: any) {
        let csvArr = [];
        try {
            for (let i = 1; i < csvRecordsArray.length; i++) {
                let currentRecord = (<string>csvRecordsArray[i]).split(";");
                if (currentRecord[0] && currentRecord[1]) {
                    currentRecord[0] = currentRecord[0].replace(",", ".");
                    currentRecord[1] = currentRecord[1].replace(",", ".");
                    let csvRecord: CurveValues = new CurveValues();
                    csvRecord.t = Number(currentRecord[0]);
                    csvRecord.value = Number(currentRecord[1]);
                    if (
                        !csvArr.some((value: CurveValues) => {
                            return value.t === csvRecord.t;
                        }) &&
                        (csvRecord.t != null || csvRecord.value != null)
                    ) {
                        csvArr.push(csvRecord);
                    }
                }
            }

            return csvArr;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
