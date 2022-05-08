import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnimalSpeciesI } from '@app/shared/models/animal-speciesI';
import { CurveValues } from '@app/shared/models/curveValues';
import { CurveValuesI } from '@app/shared/models/curveValuesI';
import { PhysiologicalParamaterI } from '@app/shared/models/physiologicalParamaterI';
import { SPPI } from '@app/shared/models/SPPI';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ParametersService } from '../../services/parameters.service';

@Component({
    selector: 'app-parameters-create',
    templateUrl: './parameters-create.component.html',
    styleUrls: ['./parameters-create.component.css'],
})
export class ParametersCreateComponent implements OnInit {
    private parameter: SPPI;
    private parameters: PhysiologicalParamaterI[];
    private physiologicalParameter: PhysiologicalParamaterI;
    private loading = true;
    private fileContent: CurveValuesI[] = [];
    private animalSpecie: AnimalSpeciesI;
    private currentParameters: PhysiologicalParamaterI[] = [];
    private formGroup: FormGroup;
    constructor(
        private fb: FormBuilder,
        private activeModal: NgbActiveModal,
        private paramsService: ParametersService
    ) { }

    ngOnInit(): void {
        this.loadParameters();
    }

    public setParameter(parameter: SPPI) {
        if (parameter) {
            this.parameter = parameter;
            this.physiologicalParameter =
                parameter.animalParameters.physiologicalParameter;
        }
    }

    public getParameter(): SPPI {
        return this.parameter;
    }

    public onSubmit(): void {
        const value: number = this.formGroup.get('value').value;
        const alert_low: number = this.formGroup.get('alert_low').value;
        const alert_high: number = this.formGroup.get('alert_high').value;
        const alert_high_2: number = this.formGroup.get('alert_high_2').value;
        const alert_low_2: number = this.formGroup.get('alert_low_2').value;

        const parameter: PhysiologicalParamaterI =
            this.formGroup.get('parameter').value;
        if (this.parameter?.animalParameters) {
            this.parameter.animalParameters.alert_low = alert_low;
            this.parameter.animalParameters.alert_high = alert_high;
            this.parameter.animalParameters.alert_high_2 = alert_high_2;
            this.parameter.animalParameters.alert_low_2 = alert_low_2;
            this.parameter.value = value;
            this.parameter.curves = this.fileContent;
        } else {
            this.parameter = {
                animalParameters: {
                    alert_high,
                    alert_high_2,
                    alert_low,
                    alert_low_2,
                    animalSpecie: this.animalSpecie,
                    physiologicalParameter: parameter,
                },
                value,
                curves: this.fileContent,
            };
        }

        this.activeModal.close(this.parameter);
    }

    public getFormGroup(): FormGroup {
        return this.formGroup;
    }

    public initFormGroup(): void {
        const physiologicalParameter: PhysiologicalParamaterI = this.parameter
            ? this.parameter?.animalParameters?.physiologicalParameter
            : this.physiologicalParameter;
        this.fileContent = this.parameter?.curves;
        this.formGroup = this.fb.group({
            parameter: [null],
            name: [
                {
                    value: physiologicalParameter?.name
                        ? physiologicalParameter?.name
                        : '',
                    disabled: true,
                },
                Validators.required,
            ],
            description: [
                {
                    value: physiologicalParameter?.description
                        ? physiologicalParameter?.description
                        : '',
                    disabled: true,
                },
                Validators.required,
            ],

            alert_low: [
                this.parameter?.animalParameters?.alert_low
                    ? this.parameter.animalParameters?.alert_low
                    : 0,
            ],
            alert_low_2: [this.parameter?.animalParameters?.alert_low_2
                ? this.parameter.animalParameters?.alert_low_2
                : 0],
            alert_high: [
                this.parameter?.animalParameters?.alert_high
                    ? this.parameter.animalParameters.alert_high
                    : 0,
            ],
            alert_high_2: [this.parameter?.animalParameters?.alert_high_2
                ? this.parameter.animalParameters?.alert_high_2
                : 0],
            value: [this.parameter?.value ? this.parameter?.value : 0],
        });
        this.loading = false;
        this.formGroup.get('parameter').valueChanges.subscribe((value) => {
            this.physiologicalParameter = value;
            this.formGroup
                .get('name')
                .setValue(this.physiologicalParameter.name);
            this.formGroup
                .get('description')
                .setValue(this.physiologicalParameter.description);
        });
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
        return this.parameter?.curves?.length > 0;
    }

    public onDeleteCurves() {
        this.parameter.curves = [];
    }

    public onFileChange(event: any): void {
        if (event.target.files && event.target.files.length) {
            const [file] = event.target.files;
            const reader = new FileReader();
            reader.readAsText(file);

            reader.onload = () => {
                const csvData = reader.result;
                const csvRecordsArray = (csvData as string).split(/\r\n|\n/);
                const records = this.getCurvesFromCSV(csvRecordsArray);
                this.fileContent = records;
            };
            reader.onerror = function() {
                console.log('error is occured while reading file!');
            };
        }
    }

    public isIBPCurve() {
        if (this.parameter) {
            return this.parameter.animalParameters.physiologicalParameter.label.toUpperCase() === 'IBP'
                || this.parameter.animalParameters.physiologicalParameter.label.toUpperCase() === 'NIBP';
        }
        const param: PhysiologicalParamaterI = this.formGroup.get('parameter').value;
        return param.label.toUpperCase() === 'IBP' || param.label.toUpperCase().toUpperCase() === 'NIBP';
    }

    public canAddCurves() {

        if (this.parameter) {
            return this.parameter.animalParameters.physiologicalParameter.label.toUpperCase() !== 'TEMP'
                && this.parameter.animalParameters.physiologicalParameter.label.toUpperCase() !== 'NIBP';
        }
        const param: PhysiologicalParamaterI = this.formGroup.get('parameter').value;
        return param.label.toUpperCase() !== 'TEMP' && param.label.toUpperCase().toUpperCase() !== 'NIBP';
    }

    public isCO2Curve() {
        if (this.parameter) {
            return this.parameter.animalParameters.physiologicalParameter.label.toUpperCase() === 'CO2';
        }
        const param: PhysiologicalParamaterI = this.formGroup.get('parameter').value;
        return param.label.toUpperCase() === 'CO2';
    }

    public getCurvesFromCSV(csvRecordsArray: any) {
        const csvArr = [];
        try {
            for (let i = 1; i < csvRecordsArray.length; i++) {
                const currentRecord = (csvRecordsArray[i] as string).split(';');
                if (currentRecord[0] && currentRecord[1]) {
                    currentRecord[0] = currentRecord[0].replace(',', '.');
                    currentRecord[1] = currentRecord[1].replace(',', '.');
                    const csvRecord: CurveValues = new CurveValues();
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

    public compareParams(
        p1: PhysiologicalParamaterI,
        p2: PhysiologicalParamaterI
    ): boolean {
        if (p1 && p2) { return p1.id_pp === p2.id_pp; }
        if (!p1 && !p2) { return true; }
        return false;
    }

    public editForm(): boolean {
        return this.physiologicalParameter != null;
    }

    public setAnimalSpecie(animal: AnimalSpeciesI): void {
        this.animalSpecie = animal;
    }

    public loadParameters(): void {
        this.paramsService.findAll().subscribe(
            (value: PhysiologicalParamaterI[]) => {
                const values: PhysiologicalParamaterI[] = [];
                value.forEach((_param: PhysiologicalParamaterI) => {
                    if (
                        !this.currentParameters.some(
                            (param: PhysiologicalParamaterI) => {
                                return param.id_pp == _param.id_pp;
                            }
                        )
                    ) {
                        values.push(_param);
                    }
                });
                this.parameters = values;
                this.initFormGroup();
            },
            (error: Error) => {
                console.error(error);
            }
        );
    }

    public setInitialValue() {
        if (this.parameter) {
            return this.parameter.animalParameters.physiologicalParameter.label.toUpperCase() === 'SPO2'
                || this.parameter.animalParameters.physiologicalParameter.label.toUpperCase() === 'TEMP'
                || this.parameter.animalParameters.physiologicalParameter.label.toUpperCase() === 'CAR'
                || this.parameter.animalParameters.physiologicalParameter.label.toUpperCase() === 'RESP'
                || this.parameter.animalParameters.physiologicalParameter.label.toUpperCase() === 'ECG'
                || this.parameter.animalParameters.physiologicalParameter.label.toUpperCase() === 'CO2';
        }
        const param: PhysiologicalParamaterI = this.formGroup.get('parameter').value;
        return param.label.toUpperCase() === 'SPO2'
            || param.label.toUpperCase() === 'TEMP'
            || param.label.toUpperCase() === 'CAR'
            || param.label.toUpperCase() === 'RESP'
            || param.label.toUpperCase() === 'ECG'
            || param.label.toUpperCase() === 'CO2';
    }

    public setCurrentParameters(parameters: PhysiologicalParamaterI[]) {
        this.currentParameters = parameters;
    }

    public getLabelInitialValue() {
        const param: PhysiologicalParamaterI = this.formGroup.get('parameter').value;
        if (this.parameter || param) {
            switch (this.parameter?.animalParameters?.physiologicalParameter?.label.toUpperCase() || param.label.toUpperCase()) {
                case 'ECG':
                    return 'Heart rate';
                case 'CO2':
                    return 'Respiration Rate';
                case 'SPO2':
                    return 'SPO2 value';
                case 'TEMP':
                    return 'Initial value';
                default:
                    break;
            }
        }
    }
}
