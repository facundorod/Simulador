import { SimulationService } from './../../../simulation/services/simulation.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';

// Service
import { AnimalSpeciesService } from './../../services/animalSpecies.service';
import { AnimalSpeciesI } from '@models/animal-speciesI';
import { BaseComponent } from '@app/shared/components/base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurvesService } from '../../services/curves.service';
import { CurvesI } from '@app/shared/models/curvesI';
import { CurvesHelper } from './../../../simulation/helpers/curvesHelper';
import { LocalStorageService } from '@app/shared/services/localStorage.service';
import { StatesI } from '@app/shared/models/stateI';
import { ParameterInfoI } from '@app/shared/models/parameterInfoI';
import { ScenarioParamsI } from '@app/shared/models/scenarioParamsI';
import { distinctUntilChanged } from 'rxjs/operators';
import { MiniMonitorComponent } from '@app/modules/monitor/components/mini-monitor/mini-monitor.component';
import { CurveValues } from '@app/shared/models/curveValues';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NibpComponent } from '../../modals/nibp/nibp.component';
import { AuthService } from '@app/services/auth.service';
import { ScenariosComponent } from '../scenarios/scenarios.component';
import { RefCurvesResponse } from '@app/shared/models/refCurvesResponse';
import { RefCurvesComponent } from '../../modals/ref-curves/ref-curves.component';
import { MonitorStateI } from '@app/shared/models/MonitorStateI';
import { CurvesInformationI } from '@app/shared/models/CurvesInformationI';
import { CurveStateI } from '@app/shared/models/curveStateI';

@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.css'],
})
export class PanelComponent extends BaseComponent implements OnInit, OnDestroy {
    private activeScenario: ScenarioParamsI; // Scenario active for simulation
    @ViewChildren('miniMonitor') miniMonitors: QueryList<MiniMonitorComponent>;
    @ViewChild('scenarios') scenarios: ScenariosComponent;
    public scenariosSimulation: ScenarioParamsI[] = [];
    public animalSpecies: AnimalSpeciesI[] = []; // Animal Species to populate the dropdown
    public animalSpecie: AnimalSpeciesI; // Animal Specie from simulation
    public simulation: any = {}; // Simulation from localStorage
    public indexSimulationActive = 0; // Index for scenario simulation Active
    public currentState: StatesI; // Curves for scenario and animalSpecie selected
    private originalCurves: CurvesI[] = [];
    private originalState: StatesI;
    // Paramaters Physiological without curves
    public fromGroupParameters: FormGroup;
    public heartRate = 0;
    public breathRate = 0;
    public temperature = 0;
    public spo2 = 0;
    public muteAlarms = false;
    public updatedState = true;
    public endTidalCO2 = 0;
    public inspirationCO2 = 0;
    public systolicIbp = 0;
    public avgIbp = 0;
    public diastolicIbp = 0;
    private meanIBP = 0;
    private curvesHelper: CurvesHelper = new CurvesHelper();
    public shiftValues: number[] = [0, 0, 0, 0];
    public amplitudeValues: number[] = [1, 1, 1, 1];
    private timeNIBP = 5;
    private startNIBP = false;
    private monitorState: MonitorStateI;
    private parameterInfo: ParameterInfoI;
    public refCurvesCapno: RefCurvesResponse[] = [];
    public refCurvesPlet: RefCurvesResponse[] = [];
    public refCurvesIBP: RefCurvesResponse[] = [];
    private firstTime: boolean = true;
    public refCurvesECG: RefCurvesResponse[] = [];
    public ecgCurrentCurve: string;
    public capnoCurrentCurve: string;
    public pletCurrentCurve: string;
    public ibpCurrentCurve: string;
    public isLoadingECG: boolean = true;
    public isLoadingCapno: boolean = true;
    public isLoadingPlet: boolean = true;
    public isLoadingIbp: boolean = true;

    constructor(
        private animalSpecieService: AnimalSpeciesService,
        private authService: AuthService,
        private fb: FormBuilder,
        private toast: ToastrService,
        private simulationService: SimulationService,
        private curvesService: CurvesService,
        private localStorageService: LocalStorageService,
        private modal: NgbModal
    ) {
        super();
    }

    ngOnInit(): void {
        // this.localStorageService.removeValue('simulationState');
        // this.localStorageService.removeValue('scenarioState');
        // this.localStorageService.removeValue('scenarioState');
        // this.monitorState = null;
        // this.setSubmitForm(false);
        // this.setLoading(true);
        // this.loadData();
        // this.initFormGroup();
        // this.initFormParameters();
        // this.onValueChanges();
        // this.onLoadCurves(this.formGroup.value.animalSpecie);
    }

    ngOnDestroy(): void {
        this.localStorageService.removeValue('simulationState');
        this.localStorageService.removeValue('Simulation');
        this.localStorageService.removeValue('scenarioState');

    }

    /**
     * Load all data necesary for forms
     */
    // private loadData() {
    //     this.simulation = JSON.parse(localStorage.getItem('Simulation'));

    //     this.animalSpecieService.list().subscribe(
    //         (animalSpecies: any) => {
    //             this.setLoading(false);
    //             this.animalSpecies = animalSpecies.data;
    //         },
    //         (error: Error) => {
    //             console.log(error);
    //         }
    //     );

    //     if (this.simulation) {
    //         if (this.simulation.scenarios) {
    //             this.scenariosSimulation = this.simulation.scenarios;

    //             // If the simulation has scenarios, the first will be the active for simulation
    //             this.activeScenario = this.scenariosSimulation[0];
    //         }

    //         if (this.simulation.animalSpecie) {
    //             this.animalSpecie = this.simulation.animalSpecie;
    //         }
    //     }
    // }

    // /**
    //  * Initialize the reactive form
    //  */
    // private initFormGroup(): void {
    //     this.formGroup = this.fb.group({
    //         simulationName: [
    //             this.simulation ? this.simulation.name : '',
    //             Validators.required,
    //         ],
    //         simulationDescription: [
    //             this.simulation ? this.simulation.description : '',
    //             Validators.required,
    //         ],
    //         animalSpecie: [
    //             this.animalSpecie ? this.animalSpecie : '',
    //             Validators.required,
    //         ],
    //     });
    // }

    // private initFormValues(): void {
    //     this.heartRate = 0;
    //     this.endTidalCO2 = 0;
    //     this.inspirationCO2 = 0;
    //     this.breathRate = 0;
    //     this.temperature = 0;
    //     this.spo2 = 0;
    //     this.shiftValues = [0, 0, 0, 0];
    //     this.amplitudeValues = [1, 1, 1, 1];
    //     this.fromGroupParameters.setValue({
    //         heartRate: 0,
    //         breathRate: 0,
    //         temperature: 0,
    //         endTidalCO2: 0,
    //         inspirationCO2: 0,
    //         spo2: 0,
    //         ibpSystolic: 0,
    //         ibpDiastolic: 0,
    //         valueToShift: [{
    //             value: 1
    //         },
    //         {
    //             value: 1
    //         },
    //         {
    //             value: 1
    //         },
    //         {
    //             value: 1
    //         }],
    //         amplitude: [{
    //             value: 1
    //         },
    //         {
    //             value: 1
    //         },
    //         {
    //             value: 1
    //         },
    //         {
    //             value: 1
    //         }]
    //     });
    // }

    // private initFormParameters(): void {
    //     this.fromGroupParameters = this.fb.group({
    //         heartRate: [this.heartRate ? this.heartRate : 0],
    //         breathRate: [this.breathRate ? this.breathRate : 0],
    //         temperature: [this.temperature ? this.temperature : 0],
    //         spo2: [this.spo2 ? this.spo2 : 0],
    //         ibpSystolic: [this.systolicIbp ? this.systolicIbp : 0],
    //         ibpDiastolic: [this.diastolicIbp ? this.diastolicIbp : 0],
    //         endTidalCO2: [this.endTidalCO2 ? this.endTidalCO2 : 0],
    //         inspirationCO2: [this.inspirationCO2 ? this.inspirationCO2 : 0],
    //         valueToShift: this.fb.array([
    //             this.fb.group({
    //                 value: 1
    //             }),
    //             this.fb.group({
    //                 value: 1
    //             }),
    //             this.fb.group({
    //                 value: 1
    //             }),
    //             this.fb.group({
    //                 value: 1
    //             })
    //         ]),
    //         amplitude: this.fb.array([
    //             this.fb.group({
    //                 value: 1
    //             }),
    //             this.fb.group({
    //                 value: 1
    //             }),
    //             this.fb.group({
    //                 value: 1
    //             }),
    //             this.fb.group({
    //                 value: 1
    //             })
    //         ])
    //     });

    // }

    // /**
    //  * Save scenario and simulations according to form data
    //  */
    // public onSaveChanges() {
    //     this.submitForm = true;
    //     this.saveSimulation();
    // }

    // /**
    //  * Change detection for each input
    //  */
    // private onValueChanges(): void {
    //     this.formGroup.get('animalSpecie').valueChanges.subscribe((val) => {
    //         this.scenarios.setAnimal(val);
    //         this.updateState();
    //         if (val && val.id_as !== this.animalSpecie?.id_as) {
    //             this.scenarios.clearScenarios();
    //             this.animalSpecie = val;
    //             this.activeScenario = null;
    //         }
    //         this.onLoadCurves(val);
    //     });
    //     this.fromGroupParameters
    //         .get('heartRate')
    //         .valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
    //             if (!this.firstTime) {
    //                 if (this.monitorState?.curvesInformation) {
    //                     const curvesState: CurveStateI = {
    //                         curves: this.monitorState.curvesInformation
    //                     }
    //                     this.curvesService.updateHeartRate2(curvesState, val, this.heartRate).subscribe((value: CurveStateI) => {
    //                         this.monitorState.curvesInformation = value.curves.map((curve: CurvesInformationI) => {
    //                             return {
    //                                 dataset: curve.dataset,
    //                                 alert_high: curve.alert_high,
    //                                 alert_low: curve.alert_low,
    //                                 colorLine: curve.colorLine,
    //                                 source: curve.source,
    //                                 description: curve.description,
    //                                 label: curve.label,
    //                                 maxY: curve.maxY,
    //                                 minY: curve.minY,
    //                                 name: curve.name,
    //                                 unit: curve.unit,
    //                                 id_pp: curve.id_pp,
    //                                 alert_high_2: curve.alert_high_2,
    //                                 alert_low_2: curve.alert_low_2,
    //                                 showCurves: curve.showCurves
    //                             }
    //                         })
    //                         this.monitorState.heartSamplingRate = value.heartSamplingRate
    //                     })
    //                 }
    //                 this.heartRate = val;
    //             } else this.firstTime = false;
    //             // if (this.originalState) {
    //             //     this.curvesService.updateHeartRate(this.originalState, val).subscribe((value: StatesI) => {
    //             //         this.currentState.curves[0] = value.curves[0];
    //             //         this.currentState.curves[2] = value.curves[2];
    //             //         this.currentState.curves[3] = value.curves[3];
    //             //         const miniMonitors: MiniMonitorComponent[] = this.miniMonitors.toArray();
    //             //         // for (let i = 0; i < miniMonitors.length; i++) {
    //             //         //     if (i != 1) {
    //             //         //         miniMonitors[i].changeMaxAndMin(this.currentState.curves[i].curveValues);
    //             //         //     }
    //             //         // }
    //             //         this.updatedState = true;

    //             //     },
    //             //         (error: Error) => {
    //             //             console.error(error);
    //             //         });
    //             // }

    //         });
    //     this.fromGroupParameters
    //         .get('breathRate')
    //         .valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
    //             this.breathRate = val;
    //             if (this.currentState?.curves?.length > 0) {
    //                 this.curvesService.updateRespirationRate(this.originalState, val).subscribe((value: StatesI) => {
    //                     this.currentState.curves[1] = value.curves[1];
    //                     // const miniMonitors: MiniMonitorComponent = this.miniMonitors.toArray()[1];
    //                     // miniMonitors.changeMaxAndMin(this.currentState.curves[1].curveValues);
    //                     this.updatedState = true;

    //                 },
    //                     (error: Error) => {
    //                         console.error(error);
    //                     });
    //             }
    //         });
    //     this.fromGroupParameters
    //         .get('temperature')
    //         .valueChanges.subscribe((val) => {
    //             this.temperature = val;
    //             this.updatedState = true;

    //         });
    //     this.fromGroupParameters.get('spo2').valueChanges.subscribe((val) => {
    //         this.spo2 = val;
    //         this.updatedState = true;
    //     });
    //     this.fromGroupParameters.get('ibpDiastolic').valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
    //         if (val !== 0) {
    //             this.diastolicIbp = val;
    //             this.meanIBP = this.curvesHelper.getMeanValue(this.diastolicIbp, this.systolicIbp);
    //             this.updateIBPCurve();
    //             this.updatedState = true;
    //         }

    //     });
    //     this.fromGroupParameters.get('ibpSystolic').valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
    //         if (val !== 0) {
    //             this.systolicIbp = val;
    //             this.meanIBP = this.curvesHelper.getMeanValue(this.diastolicIbp, val);
    //             this.adjustPressureValues();
    //             this.updateIBPCurve();
    //             this.updatedState = true;
    //         }
    //     });
    //     this.fromGroupParameters.get('endTidalCO2').valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
    //         if (val !== 0) {
    //             this.endTidalCO2 = val;
    //             this.updateCO2Curve();
    //         }
    //     });
    //     this.fromGroupParameters.get('inspirationCO2').valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
    //         if (val !== 0) {
    //             this.inspirationCO2 = val;
    //             this.updateCO2Curve();
    //         }
    //     });
    //     this.fromGroupParameters.get('valueToShift').valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
    //         val.forEach((value: { value: number }, index: number) => {
    //             if (value.value != this.shiftValues[index]) {
    //                 if (value.value === 0) {
    //                     if (this.currentState?.curves[index]?.curveValues) {
    //                         this.currentState.curves[index].curveValues = JSON.parse(JSON.stringify(this.originalCurves[index].curveValues));
    //                         this.updatedState = true;
    //                     }
    //                 } else {
    //                     this.shiftValues[index] = value.value;
    //                     if (this.currentState?.curves[index]?.curveValues) {

    //                         const curveToShift: [number, number][] = this.currentState.curves[index].curveValues;
    //                         if (curveToShift) {
    //                             this.curvesService
    //                                 .shiftCurve(curveToShift, value.value)
    //                                 .subscribe((newCurve: [number, number][]) => {
    //                                     if (newCurve) {
    //                                         this.currentState.curves[index].curveValues = newCurve;
    //                                     }
    //                                     // const miniMonitor: MiniMonitorComponent = this.miniMonitors.toArray()[index];
    //                                     // miniMonitor.changeMaxAndMin(this.currentState.curves[index].curveValues);
    //                                 },
    //                                     (error: Error) => {
    //                                         console.error(error);
    //                                     });
    //                         }
    //                     }
    //                 }

    //             }
    //         });
    //     });

    //     this.fromGroupParameters.get('amplitude').valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {

    //         val.forEach((value: { value: number }, index: number) => {
    //             if (value.value != this.amplitudeValues[index]) {
    //                 if (value.value === 1) {
    //                     if (this.currentState?.curves[index]?.curveValues) {
    //                         this.currentState.curves[index].curveValues = JSON.parse(JSON.stringify(this.originalCurves[index].curveValues));
    //                         this.updatedState = true;
    //                     }
    //                 } else {
    //                     this.amplitudeValues[index] = value.value;
    //                     if (this.currentState?.curves[index]?.curveValues) {

    //                         const curveToChange: [number, number][] = this.currentState.curves[index].curveValues;
    //                         if (curveToChange) {
    //                             this.curvesService
    //                                 .calculateAmplitude(curveToChange, value.value)
    //                                 .subscribe((newCurve: [number, number][]) => {
    //                                     if (newCurve) {
    //                                         this.currentState.curves[index].curveValues = newCurve;
    //                                     }
    //                                     const miniMonitor: MiniMonitorComponent = this.miniMonitors.toArray()[index];
    //                                     // miniMonitor.changeMaxAndMin(this.currentState.curves[index].curveValues);
    //                                 },
    //                                     (error: Error) => {
    //                                         console.error(error);
    //                                     });
    //                         }
    //                     }
    //                 }
    //             }
    //         });
    //     });
    // }

    // private updateCO2Curve(): void {
    //     const { curveValues: co2Curve } = this.currentState.curves[1];
    //     if (co2Curve) {
    //         this.curvesService.updateCO2(co2Curve, this.endTidalCO2, this.inspirationCO2)
    //             .subscribe((newCurve: [number, number][]) => {
    //                 if (newCurve) {
    //                     this.currentState.curves[1].curveValues = newCurve;
    //                 }
    //                 // const miniMonitor: MiniMonitorComponent = this.miniMonitors.toArray()[1];
    //                 // miniMonitor.changeMaxAndMin(this.currentState.curves[1].curveValues);
    //                 this.updatedState = true;
    //             },
    //                 (error: Error) => {
    //                     console.error(error);
    //                 });
    //     }

    // }
    // private updateIBPCurve(): void {
    //     const { curveValues: ibpCurve } = this.currentState.curves[2];
    //     if (ibpCurve) {
    //         this.curvesService
    //             .updatePressure(ibpCurve, this.systolicIbp, this.diastolicIbp)
    //             .subscribe((newCurve: [number, number][]) => {
    //                 if (newCurve) {
    //                     this.currentState.curves[2].curveValues = newCurve;
    //                 }
    //                 const miniMonitor: MiniMonitorComponent = this.miniMonitors.toArray()[2];
    //                 // miniMonitor.changeMaxAndMin(this.currentState.curves[2].curveValues);
    //             },
    //                 (error: Error) => {
    //                     console.error(error);
    //                 });
    //     }
    // }

    // /**
    //  * Load curves for scenario active for simulation and animalSpecie selected
    //  */
    // public onLoadCurves(as: AnimalSpeciesI) {

    //     if (this.activeScenario?.id_scenario && as?.id_as) {
    //         this.curvesService
    //             .findAll({
    //                 animalSpecie: as.id_as,
    //                 scenario: this.activeScenario.id_scenario,
    //             })
    //             .subscribe(
    //                 (state: StatesI) => {
    //                     if (state) {
    //                         let action = 'play';
    //                         let newScenario = false;
    //                         if (this.currentState) {
    //                             newScenario = true;
    //                         }
    //                         this.originalState = JSON.parse(JSON.stringify(state));
    //                         this.currentState = state;
    //                         this.setMonitorState(state);

    //                         this.originalCurves = JSON.parse(JSON.stringify(state.curves));
    //                         this.currentState.action = action;
    //                         this.currentState.muteAlarms = false;
    //                         this.currentState.newScenario = newScenario;
    //                         this.onLoadParameters();
    //                         this.setLoading(false);
    //                         this.scenarios.setAnimal(as);
    //                         // this.loadRefCurves();
    //                         this.applyChanges();

    //                     } else {
    //                         this.currentState = null;
    //                         this.setLoading(false);
    //                         this.originalCurves = [];
    //                         this.localStorageService.removeValue(
    //                             'simulationState'
    //                         );
    //                     }
    //                 },
    //                 (error: any) => {
    //                     console.log(error);
    //                 }
    //             );
    //     } else {
    //         this.currentState = null;
    //         this.originalCurves = [];
    //         this.localStorageService.removeValue('simulationState');
    //         this.setLoading(false);
    //     }
    // }

    // public applyChanges(): void {
    //     this.localStorageService.saveValue(
    //         'simulationState',
    //         JSON.stringify(this.currentState)
    //     );
    //     this.localStorageService.saveValue('scenarioState', JSON.stringify(this.monitorState))
    //     this.saveParameterInfo();
    //     this.updateState();
    // }

    // public onLoadRefCurves(parameter: string): void {
    //     // const refModalCurves = this.modal.open(RefCurvesComponent, { size: 'lg', windowClass: 'modal-small' });
    //     // let curves = [];
    //     // let index = 0;
    //     // switch (parameter) {
    //     //     case 'ECG':
    //     //         curves = this.refCurvesECG;
    //     //         break;
    //     //     case 'SPO2':
    //     //         curves = this.refCurvesPlet;
    //     //         index = 3;
    //     //         break;
    //     //     case 'CO2':
    //     //         curves = this.refCurvesCapno;
    //     //         index = 1;
    //     //         break;
    //     //     case 'IBP':
    //     //         curves = this.refCurvesIBP;
    //     //         index = 2;
    //     //         break;
    //     //     default:
    //     //         break;
    //     // }
    //     // refModalCurves.componentInstance.setRefCurves(curves);

    //     // refModalCurves.result.then((refCurve: {
    //     //     curves: [number, number][],
    //     //     name: string,
    //     //     description: string
    //     // }) => {
    //     //     if (refCurve && refCurve.curves.length) {
    //     //         this.curvesService.normalizeCurve(refCurve.curves).subscribe((curve: [number, number][]) => {
    //     //             const auxCurrentState = JSON.parse(JSON.stringify(this.currentState));
    //     //             auxCurrentState.curves[index].curveValues = curve;
    //     //             if (index == 1) {
    //     //                 this.capnoCurrentCurve = refCurve.name;
    //     //                 this.endTidalCO2 = Math.round(this.getMaxYValue(curve).value);
    //     //                 this.inspirationCO2 = Math.round(curve[0][1]);
    //     //                 this.curvesService.updateRespirationRate(auxCurrentState, this.breathRate).subscribe((newState: StatesI) => {
    //     //                     this.currentState.curves[1].curveValues = newState.curves[1].curveValues;
    //     //                     this.originalCurves[1].curveValues = newState.curves[1].curveValues;
    //     //                     this.originalState.curves[index].curveValues = newState.curves[1].curveValues;
    //     //                     this.updatedState = true;
    //     //                 })
    //     //             } else {
    //     //                 this.curvesService.updateHeartRate(auxCurrentState, this.heartRate).subscribe((newState: StatesI) => {
    //     //                     this.currentState.curves[index].curveValues = newState.curves[index].curveValues;
    //     //                     this.originalCurves[index].curveValues = newState.curves[index].curveValues;
    //     //                     this.originalState.curves[index].curveValues = newState.curves[index].curveValues;
    //     //                     if (index == 0) {
    //     //                         this.ecgCurrentCurve = refCurve.name;
    //     //                     }

    //     //                     if (index == 2) {
    //     //                         this.systolicIbp = Math.round(this.getMaxYValue(curve).value);
    //     //                         this.diastolicIbp = Math.round(curve[0][1]);
    //     //                         this.ibpCurrentCurve = refCurve.name;
    //     //                         this.fromGroupParameters.patchValue({ ibpSystolic: this.systolicIbp, ibpDiastolic: this.diastolicIbp });
    //     //                     }
    //     //                     if (index == 3) {
    //     //                         this.pletCurrentCurve = refCurve.name;
    //     //                     }
    //     //                     const miniMonitor: MiniMonitorComponent = this.miniMonitors.toArray()[index];
    //     //                     // miniMonitor.changeMaxAndMin(newState.curves[index].curveValues);
    //     //                 })
    //     //             }

    //     //         })


    //     //     }

    //     // })
    //     //     .catch((error: any) => {
    //     //         console.error("Error", error);
    //     //     });
    // }

    // public showParam(curve: CurvesI): boolean {
    //     switch (curve.curveConfiguration.label) {
    //         case "ECG":
    //             return !this.isLoadingECG;
    //         case "CO2":
    //             return !this.isLoadingCapno;
    //         case "SPO2":
    //             return !this.isLoadingPlet;
    //         case "IBP":
    //             return !this.isLoadingECG;
    //         default:
    //             break;
    //     }
    // }

    // private loadRefCurves(): void {
    //     // const animalId: number | undefined = this.animalSpecie?.id_as;
    //     // if (animalId) {
    //     //     this.curvesService.getRefCurves(animalId, 'ECG').subscribe((value: RefCurvesResponse[]) => {
    //     //         if (value) {
    //     //             this.refCurvesECG = value;
    //     //         }
    //     //         this.isLoadingECG = false;
    //     //     });

    //     //     this.curvesService.getRefCurves(animalId, 'CO2').subscribe((value: RefCurvesResponse[]) => {
    //     //         if (value) {
    //     //             this.refCurvesCapno = value;
    //     //         }
    //     //         this.isLoadingCapno = false;
    //     //     })

    //     //     this.curvesService.getRefCurves(animalId, 'SPO2').subscribe((value: RefCurvesResponse[]) => {
    //     //         if (value) {
    //     //             this.refCurvesPlet = value;
    //     //         }
    //     //         this.isLoadingPlet = false;
    //     //     })

    //     //     this.curvesService.getRefCurves(animalId, 'IBP').subscribe((value: RefCurvesResponse[]) => {
    //     //         if (value) {
    //     //             this.refCurvesIBP = value;
    //     //         }
    //     //         this.isLoadingIbp = false;
    //     //     })
    //     // }

    // }

    // /**
    //  * Load parameters without curves
    //  */
    // private onLoadParameters(): void {
    //     this.currentState.curves = this.currentState.curves.filter(
    //         (value: CurvesI) => {
    //             switch (value.curveConfiguration.label.toUpperCase()) {
    //                 case 'ECG':
    //                     this.heartRate = value.curveConfiguration.refValue;
    //                     return value;
    //                 case 'TEMP':
    //                     this.temperature = value.curveConfiguration.refValue;
    //                     return value;
    //                 case 'SPO2':
    //                     this.spo2 = value.curveConfiguration.refValue;
    //                     return value;
    //                 case 'IBP':
    //                     this.systolicIbp = Math.round(this.getMaxYValue(value.curveValues).value);
    //                     this.diastolicIbp = Math.round(value.curveValues[0][1]);
    //                     this.meanIBP = this.curvesHelper.getMeanValue(this.diastolicIbp, this.systolicIbp);
    //                     return value;
    //                 case 'CO2':
    //                     this.breathRate = value.curveConfiguration.refValue;
    //                     this.inspirationCO2 = Math.round(value.curveValues[0][1]);
    //                     this.endTidalCO2 = Math.round(this.getMaxYValue(value.curveValues).value);
    //                     return value;
    //                 default:
    //                     return value;
    //             }
    //         }
    //     );
    //     this.fromGroupParameters.setValue({
    //         ibpSystolic: this.systolicIbp,
    //         ibpDiastolic: this.diastolicIbp,
    //         heartRate: this.heartRate,
    //         breathRate: this.breathRate,
    //         temperature: this.temperature,
    //         spo2: this.spo2,
    //         valueToShift: [{
    //             value: 1
    //         },
    //         {
    //             value: 1
    //         },
    //         {
    //             value: 1
    //         },
    //         {
    //             value: 1
    //         }],
    //         amplitude: [{
    //             value: 1
    //         },
    //         {
    //             value: 1
    //         },
    //         {
    //             value: 1
    //         },
    //         {
    //             value: 1
    //         }],
    //         endTidalCO2: this.endTidalCO2,
    //         inspirationCO2: this.inspirationCO2
    //     });

    // }

    // private saveParameterInfo(): void {
    //     const parameterInfo: ParameterInfoI = {
    //         temperature: this.temperature,
    //         heartRate: this.heartRate,
    //         breathRate: this.breathRate,
    //         spO2: this.spo2,
    //         endTidalCO2: this.endTidalCO2,
    //         ibpDiastolic: this.diastolicIbp,
    //         ibpMean: this.meanIBP,
    //         ibpSystolic: this.systolicIbp,
    //         inspirationCO2: this.inspirationCO2,
    //         timeNIBP: this.timeNIBP,
    //         startNIBP: this.startNIBP
    //     };
    //     this.parameterInfo = parameterInfo;
    //     this.localStorageService.saveValue(
    //         'parameterState',
    //         JSON.stringify(parameterInfo)
    //     );
    // }

    // /**
    //  * Save simulation
    //  */
    // private saveSimulation(): void {
    //     const simulationData = {
    //         name: this.formGroup.value.simulationName,
    //         description: this.formGroup.value.simulationDescription,
    //         animalSpecie: {
    //             id_as: this.formGroup.value.animalSpecie.id_as,
    //             name: this.formGroup.value.animalSpecie.name,
    //             description: this.formGroup.value.animalSpecie.description,
    //         },
    //         scenarios: this.scenariosSimulation,
    //     };

    //     // Create simulation
    //     if (!this.simulation) {
    //         this.simulationService.create(simulationData).subscribe(
    //             (data: any) => {
    //                 this.toast.toastrConfig.timeOut = 1000;
    //                 this.toast.toastrConfig.positionClass = 'toast-bottom-left';
    //                 this.toast.toastrConfig.closeButton = true;
    //                 this.toast.success('Simulation saved!');
    //                 this.simulation = simulationData;
    //                 this.simulation.id_simulation = data.id_simulation;
    //             },
    //             (error: Error) => {
    //                 console.error(error);
    //                 this.toast.toastrConfig.timeOut = 1000;
    //                 this.toast.toastrConfig.positionClass = 'toast-bottom-left';
    //                 this.toast.toastrConfig.closeButton = true;
    //                 this.toast.error('Error saving simulation');
    //             }
    //         );
    //     } else {
    //         // Edit simulation
    //         this.simulationService
    //             .updateById(this.simulation.id_simulation, simulationData)
    //             .subscribe(
    //                 () => {
    //                     this.toast.toastrConfig.timeOut = 1000;
    //                     this.toast.toastrConfig.positionClass =
    //                         'toast-bottom-left';
    //                     this.toast.toastrConfig.closeButton = true;
    //                     this.toast.success('Simulation saved!');
    //                 },
    //                 (error: Error) => {
    //                     this.toast.toastrConfig.timeOut = 1000;
    //                     this.toast.toastrConfig.positionClass =
    //                         'toast-bottom-left';
    //                     this.toast.toastrConfig.closeButton = true;
    //                     this.toast.error('Error saving simulation');
    //                 }
    //             );
    //     }
    // }

    // public getScenarios(scenarios: any): void {
    //     this.scenariosSimulation = scenarios;
    //     if (
    //         this.activeScenario !=
    //         this.scenariosSimulation[this.indexSimulationActive]
    //     ) {
    //         this.activeScenario =
    //             this.scenariosSimulation[this.indexSimulationActive];
    //         this.currentState = null;
    //         this.initFormValues();
    //         this.onLoadCurves(this.formGroup.value.animalSpecie);
    //     }
    // }

    // public getPosScenarios(pos: any): void {
    //     if (this.indexSimulationActive != pos.indexActive) {
    //         this.indexSimulationActive = pos.indexActive;
    //         this.activeScenario =
    //             this.scenariosSimulation[this.indexSimulationActive];
    //         this.onLoadCurves(this.formGroup.value.animalSpecie);
    //     }
    // }

    // public onPlaySimulation(): void {
    //     if (this.currentState) { this.currentState.action = 'play'; }
    //     this.applyChanges();

    // }

    // public onPauseSimulation(): void {
    //     if (this.currentState) { this.currentState.action = 'pause'; }
    //     this.monitorState.simulationStatus = 'PAUSED'
    //     this.applyChanges();
    // }

    // public onMuteAlarms(): void {
    //     if (this.currentState) { this.currentState.muteAlarms = true; }
    //     this.muteAlarms = true;
    //     this.applyChanges();
    // }

    // public onUnmuteAlarms(): void {
    //     if (this.currentState) { this.currentState.muteAlarms = false; }
    //     this.muteAlarms = false;
    //     this.applyChanges();
    // }

    // public onStopSimulation(): void {
    //     if (this.currentState) { this.currentState.action = 'stop'; }
    //     this.applyChanges();
    // }

    // private updateState(): void {
    //     if (this.currentState) {
    //         this.currentState.state++;
    //         this.currentState.newScenario = false;
    //         this.localStorageService.saveValue(
    //             'simulationState',
    //             JSON.stringify(this.currentState)
    //         );
    //     }
    //     if (this.monitorState) {
    //         this.monitorState.id++;
    //         this.localStorageService.saveValue(
    //             'scenarioState',
    //             JSON.stringify(this.monitorState)
    //         );
    //     }
    // }

    // public getRate(index: number): number {
    //     const curve: CurvesI = this.currentState.curves[index];
    //     if (curve.curveConfiguration.label.toUpperCase() === 'CO2') {
    //         return this.breathRate;
    //     }
    //     return this.heartRate;
    // }

    // public breathCurve(index: number): boolean {
    //     const curve: CurvesI = this.currentState.curves[index];
    //     if (
    //         curve.curveConfiguration.label.toUpperCase() === 'ETCO2' ||
    //         curve.curveConfiguration.label.toUpperCase() === 'CO2'
    //     ) {
    //         return true;
    //     }
    //     return false;
    // }

    // /**
    //  *  TrackByFn: Define como rastrear los cambios en los ítems utilizados en el *ngFor.
    //  *  Aumenta el rendimiento, ya que solo se vuelven a representar en el DOM los nodos
    //  *  que han sido actualizados.
    //  */
    // public trackByFnAnimalSpecies(index: number, name: AnimalSpeciesI): number {
    //     return name.id_as;
    // }


    // private adjustPressureValues() {
    //     if (this.systolicIbp <= this.diastolicIbp) {
    //         this.diastolicIbp = this.systolicIbp - 1;
    //     }
    // }

    // public existCurves(): boolean {
    //     return this.currentState?.curves?.length > 0;
    // }

    // private getMaxYValue(curves: [number, number][]): { index: number, value: number } {
    //     let max: number = curves[0][1];
    //     let index = 0;
    //     for (let i = 0; i < curves.length; i++) {
    //         if (curves[i][1] > max) {
    //             max = curves[i][1];
    //             index = i;
    //         }
    //     }
    //     return { index, value: max };
    // }


    // public resetSimulation(): void {
    //     this.currentState = this.originalState;
    //     this.currentState.curves = JSON.parse(JSON.stringify(this.originalCurves));
    //     this.currentState.action = 'stop';
    //     this.systolicIbp = Math.round(this.getMaxYValue(this.currentState.curves[2].curveValues).value);
    //     this.diastolicIbp = Math.round(this.currentState.curves[2].curveValues[0][1]);
    //     this.meanIBP = this.curvesHelper.getMeanValue(this.diastolicIbp, this.systolicIbp);
    //     this.onLoadParameters();
    //     this.initFormParameters();
    //     this.onValueChanges();
    // }

    // public configureNIBP(): void {
    //     const modal = this.modal.open(NibpComponent, { size: 'm', windowClass: 'modal-small' });
    //     modal.componentInstance.setInitialValue(this.timeNIBP);
    //     modal.result.then((nibpSettings: { timeNibp: number, startNow: boolean }) => {
    //         this.timeNIBP = nibpSettings.timeNibp;
    //         this.startNIBP = nibpSettings.startNow;
    //         this.applyChanges();
    //         this.startNIBP = false;
    //     })
    //         .catch((error: Error) => {
    //             console.error(error);
    //         });

    // }

    // public isUserAdmin(): boolean {
    //     return this.authService.isAdmin();
    // }

    // private setMonitorState(state: StatesI): void {
    //     if (state) {
    //         const curvesInformation: CurvesInformationI[] = state.curves.map((curve: CurvesI) => {
    //             return {
    //                 dataset: curve.curveValues,
    //                 alert_low: curve.curveConfiguration.alert_low,
    //                 alert_high: curve.curveConfiguration.alert_high,
    //                 alert_high2: curve.curveConfiguration.alert_high_2,
    //                 alert_low2: curve.curveConfiguration.alert_low_2,
    //                 label: curve.curveConfiguration.label,
    //                 unit: curve.curveConfiguration.unit,
    //                 name: curve.curveConfiguration.name,
    //                 colorLine: curve.curveConfiguration.colorLine,
    //                 minY: curve.curveConfiguration.minY,
    //                 maxY: curve.curveConfiguration.maxY,
    //                 description: curve.curveConfiguration.description,
    //                 showCurves: curve.curveConfiguration.showMonitor,
    //                 source: curve.curveConfiguration.source,
    //                 id_pp: curve.curveConfiguration.id_pp
    //             }
    //         })

    //         this.monitorState = {
    //             batteryStatus: 'NORMAL',
    //             curvesInformation,
    //             heartSamplingRate: state.heartSamplingRate,
    //             breathSamplingRate: state.breathSamplingRate,
    //             currentIndexBreath: 0,
    //             currentIndexHeart: 0,
    //             scenario: {
    //                 animalName: this.animalSpecie.name,
    //                 description: this.activeScenario.description,
    //                 name: this.activeScenario.name
    //             },
    //             totalPoints: state.totalPoints,
    //             totalPointsPerCycle: state.totalPointsPerCycle,
    //             simulationStatus: 'RUNNING',
    //             soundStatus: {
    //                 alarms: true,
    //                 batterySound: true,
    //                 heartFreqSound: true
    //             },
    //             id: this.currentState.state,
    //             parameterInformation: this.parameterInfo
    //         }
    //         this.localStorageService.saveValue('scenarioState', JSON.stringify(this.monitorState));
    //     }

    // }
}

