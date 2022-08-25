import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartConfigurer, ChartOptions, commonOptions } from '@app/modules/simulation/helpers/chartConfigurer';
import { CurvesHelper } from '@app/modules/simulation/helpers/curvesHelper';
import { AnimalSpeciesI } from '@app/shared/models/animal-speciesI';
import { CurveValues } from '@app/shared/models/curveValues';
import { CurveValuesI } from '@app/shared/models/curveValuesI';
import { PhysiologicalParamaterI } from '@app/shared/models/physiologicalParamaterI';
import { SPPI } from '@app/shared/models/SPPI';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApexAxisChartSeries, ChartComponent } from 'ng-apexcharts';
import { ParametersService } from '../../services/parameters.service';

@Component({
    selector: 'app-parameters-create',
    templateUrl: './parameters-create.component.html',
    styleUrls: ['./parameters-create.component.css'],
})
export class ParametersCreateComponent implements OnInit {
    @ViewChild('chart') chartComponent: ChartComponent;
    private parameter: SPPI;
    private parameters: PhysiologicalParamaterI[];
    private chart: Partial<ChartOptions>;
    private physiologicalParameter: PhysiologicalParamaterI;
    private loading = true;
    private fileContent: CurveValuesI[] = [];
    private animalSpecie: AnimalSpeciesI;
    private currentParameters: PhysiologicalParamaterI[] = [];
    private formGroup: FormGroup;
    private curvesHelper: CurvesHelper = new CurvesHelper();
    public showChart: boolean = false;

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

    public changeCurves(): boolean {
        if (this.parameter?.curves?.length > 0 || this.fileContent?.length > 0) return true;
        return false;
    }

    public onDeleteCurves() {
        if (this.parameter && this.parameter.curves) this.parameter.curves = [];
        this.fileContent = [];
        this.showChart = false;
    }

    public onFileChange(event: any): void {
        if (event.target.files && event.target.files.length) {
            const [file] = event.target.files;
            const reader = new FileReader();
            reader.readAsText(file);
            this.onDeleteCurves();
            reader.onload = () => {
                const csvData = reader.result;
                const csvRecordsArray = (csvData as string).split(/\r\n|\n/);
                const records = this.getCurvesFromCSV(csvRecordsArray);
                this.fileContent = records;
                const curveValues: [number, number][] = this.fileContent.map((value: CurveValuesI) => {
                    return [+value.t, +value.value];
                })
                if (this.parameter) this.parameter.curves = records;
                this.updateChart(curveValues);
            };
            reader.onerror = function () {
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
                this.createPreviewChart();
                this.loading = false;

            },
            (error: Error) => {
                this.loading = false;
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

    public isSPO2Curve() {
        if (this.parameter) {
            return this.parameter.animalParameters.physiologicalParameter.label.toUpperCase() === 'SPO2';
        }
        const param: PhysiologicalParamaterI = this.formGroup.get('parameter').value;
        return param.label.toUpperCase() === 'SPO2';
    }

    private createPreviewChart(): void {
        if (this.fileContent) {
            const curveValues: [number, number][] = this.fileContent.map((value: CurveValuesI) => {
                return [+value.t, +value.value];
            })
            if (curveValues && curveValues.length) {
                const maxY: number =
                    this.curvesHelper.getMaxY(curveValues) == 0 ? 1
                        : this.curvesHelper.getMaxY(curveValues);
                const minY = 0;
                const chart: ChartConfigurer = new ChartConfigurer({
                    colorLine: this.parameter?.animalParameters?.physiologicalParameter?.colorLine,
                    height: 100,
                    minX: 0,
                    maxX: 1,
                    minY,
                    maxY,
                    toolbar: false,
                });
                chart.setChart(curveValues, 'area', '100%');
                this.chart = chart.getChart();
                this.loading = false;
                this.showChart = true;
            }
        }
    }

    public getChart(): Partial<ChartOptions> {
        return this.chart;
    }

    /**
    * Update all Apex Charts
    */
    private updateChart(data: [number, number][]): void {
        this.showChart = true;
        let chart: ChartComponent = this.chartComponent;
        if (chart) {
            chart.updateSeries([{ data: data }], true);
            this.changeMaxAndMin(data);
        } else {
            this.createPreviewChart();
            if (chart) chart.updateSeries([{ data: data }], true);
        }
    }

    public changeMaxAndMin(curves: [number, number][]): void {
        const maxY: number =
            this.curvesHelper.getMaxY(curves) == 0 ? 1
                : this.curvesHelper.getMaxY(curves);
        const minY = 0;
        const options: Partial<ChartOptions> = commonOptions(
            false,
            1,
            0,
            maxY,
            minY
        );
        this.chartComponent.updateOptions(options);
    }
}
