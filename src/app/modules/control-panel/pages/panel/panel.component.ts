import { SimulationService } from "./../../../simulation/services/simulation.service";
import { ToastrService } from "ngx-toastr";
import { Component, Input, OnInit } from "@angular/core";

// Service
import { AnimalSpeciesService } from "./../../services/animalSpecies.service";

// Models
import { PathologyI } from "@models/pathologyI";
import { MedicationI } from "@models/medicationI";
import { ArrhythmiaI } from "@models/arrhythmiaI";
import { AnimalSpeciesI } from "@models/animal-speciesI";
import { BaseComponent } from "@app/shared/components/base.component";
import { FormBuilder, Validators } from "@angular/forms";
import { CurvesService } from "../../services/curves.service";
import { CurvesI } from "@app/shared/models/curvesI";
import { PhysiologicalParamaterI } from "@app/shared/models/PhysiologicalParamaterI";
import * as CurvesHelper from "./../../../simulation/helpers/curvesHelper";

@Component({
    selector: "app-panel",
    templateUrl: "./panel.component.html",
    styleUrls: ["./panel.component.css"],
})
export class PanelComponent extends BaseComponent implements OnInit {
    editScenario: any = {}; // Scenario active for edit
    activeScenario: any; // Scenario active for simulation
    simulationsNumber: number = 0; // Number of simulation's scenario.

    scenariosSimulation: any[] = [];
    animalSpecies: any[] = []; // Animal Species to populate the dropdown
    animalSpecie: any = {}; // Animal Specie from simulation
    simulation: any = {}; // Simulation from localStorage
    indexActive: number = 0; // Index for scenario edit Active
    indexSimulationActive: number = 0; // Index for scenario simulation Active
    public curves: any[]; // Curves for scenario and animalSpecie selected
    CurvesHelper = new CurvesHelper.CurvesHelper();

    // CURVES DATA //
    ecgCurve: number[][] = new Array(new Array()); // Curve to model ECG
    ibpCurve: number[][] = new Array(new Array()); // Curve to model blood Pressure invasive
    capnographyCurve: number[][] = new Array(new Array()); // Curve to model capnography
    nibpCurve: number[][] = new Array(new Array()); // Curve to model blood Pressure no invasive
    plethCurve: number[][] = new Array(new Array()); // Curve to model plethysmography

    // Configuration Curves //
    capnographyConfiguration: CurvesI; // Capnography configurations
    plethConfiguration: CurvesI; // Plethismography configurations
    ecgCurveConfiguration: CurvesI; // ECG configurations
    ibpConfiguration: CurvesI; // IBP Configuration
    nibpConfiguration: CurvesI; // NIBP Configurations

    // Paramaters Physiological without curves
    cardiacFrequency: CurvesI;
    respFrequency: CurvesI;
    temperature: CurvesI;

    constructor(
        private animalSpecieService: AnimalSpeciesService,
        private fb: FormBuilder,
        private toast: ToastrService,
        private simulationService: SimulationService,
        private curvesService: CurvesService
    ) {
        super();
    }

    ngOnInit(): void {
        this.setSubmitForm(false);
        this.setLoading(true);
        this.loadData();
        this.initFormGroup();
        this.onLoadCurves();
    }

    /**
     * Load all data necesary for forms
     */
    private loadData() {
        this.simulation = JSON.parse(localStorage.getItem("Simulation"));

        this.animalSpecieService.list().subscribe(
            (animalSpecies: any) => {
                this.animalSpecies = animalSpecies.data;
            },
            (error: any) => {
                console.log(error);
            }
        );

        // Create new simulation
        if (!this.simulation) {
            this.animalSpecieService.list(null, null).subscribe(
                (animalSpecies) => {
                    this.setLoading(false);
                    this.animalSpecies = animalSpecies.data;
                },
                (error: any) => {
                    console.log(error);
                }
            );
        }
        // Edit simulation
        else {
            if (this.simulation.scenarios) {
                this.scenariosSimulation = this.simulation.scenarios;
                // If the simulation has scenarios, the first will be the active for simulation
                this.activeScenario = this.scenariosSimulation[0];
            }

            if (this.simulation.animalSpecie)
                this.animalSpecie = this.simulation.animalSpecie;
        }

        this.setLoading(false);
    }

    /**
     * Initialize the reactive form
     */
    private initFormGroup() {
        this.setSubmitForm(false);
        this.formGroup = this.fb.group({
            simulationName: [
                this.simulation ? this.simulation.name : "",
                Validators.required,
            ],
            simulationDescription: [
                this.simulation ? this.simulation.description : "",
                Validators.required,
            ],
            animalSpecie: [
                this.animalSpecie ? this.animalSpecie : "",
                Validators.required,
            ],

            cardiacFrequency: [
                this.cardiacFrequency ? this.cardiacFrequency : 0,
            ],
            respFrequency: [this.respFrequency ? this.respFrequency : 0],
            temperature: [this.temperature ? this.temperature : 0],
        });
    }

    /**
     * Save scenario and simulations according to form data
     */
    public async onSaveChanges() {
        this.submitForm = true;
        this.saveSimulation();
    }

    /**
     * Load curves for scenario active for simulation and for animalSpecie selected
     */
    public onLoadCurves() {
        console.log(this.activeScenario);
        if (this.activeScenario && this.formGroup.value.animalSpecie != null) {
            this.curvesService
                .findAll({
                    animalSpecie: this.formGroup.value.animalSpecie.id_as,
                    scenario: this.activeScenario.id_scenario,
                })
                .subscribe(
                    (curves: any) => {
                        if (curves.data.length > 0) {
                            this.curves = curves.data;
                            this.setCurves();
                        }
                    },
                    (error: any) => {
                        console.log(error);
                    }
                );
        } else this.curves = [];
    }

    /**
     * Loop through array of curves and set each one
     */
    private setCurves() {
        if (this.curves.length == 0) {
            this.plethCurve = [[]];
            this.respFrequency = null;
            this.respFrequency = null;
            this.capnographyCurve = [[]];
            this.ecgCurve = [[]];
            this.ecgCurveConfiguration = null;
            this.nibpCurve = [[]];
            this.ibpConfiguration = null;
            this.ibpCurve = null;
            this.capnographyConfiguration = null;
            this.nibpConfiguration = null;
        } else {
            this.curves.forEach((cv: any) => {
                const physiologicalParameter: PhysiologicalParamaterI =
                    cv.ppPerAs.physiologicalParameter;
                switch (physiologicalParameter.label.toUpperCase()) {
                    case CurvesHelper.PhysiologicalParamaters.SPO2: {
                        if (!this.plethConfiguration) {
                            this.plethConfiguration = {
                                label: cv.ppPerAs.physiologicalParameter.label,
                                unit: cv.ppPerAs.physiologicalParameter.unit,
                                alert_high: cv.ppPerAs.alert_high,
                                alert_low: cv.ppPerAs.alert_low,
                            };
                        }
                        this.plethCurve.push([+cv.t, +cv.value]);
                        break;
                    }
                    case CurvesHelper.PhysiologicalParamaters.ETCO2: {
                        if (!this.capnographyConfiguration) {
                            this.capnographyConfiguration = {
                                label: cv.ppPerAs.physiologicalParameter.label,
                                unit: cv.ppPerAs.physiologicalParameter.unit,
                                alert_high: cv.ppPerAs.alert_high,
                                alert_low: cv.ppPerAs.alert_low,
                            };
                        }
                        this.capnographyCurve.push([+cv.t, +cv.value]);
                        break;
                    }
                    case CurvesHelper.PhysiologicalParamaters.ECG: {
                        if (!this.ecgCurveConfiguration) {
                            this.ecgCurveConfiguration = {
                                label: cv.ppPerAs.physiologicalParameter.label,
                                unit: cv.ppPerAs.physiologicalParameter.unit,
                                alert_high: cv.ppPerAs.alert_high,
                                alert_low: cv.ppPerAs.alert_low,
                            };
                        }
                        this.ecgCurve.push([+cv.t, +cv.value]);
                        break;
                    }
                    case CurvesHelper.PhysiologicalParamaters.IBP: {
                        if (!this.ibpConfiguration) {
                            this.ibpConfiguration = {
                                label: cv.ppPerAs.physiologicalParameter.label,
                                unit: cv.ppPerAs.physiologicalParameter.unit,
                                alert_high: cv.ppPerAs.alert_high,
                                alert_low: cv.ppPerAs.alert_low,
                            };
                        }
                        this.ibpCurve.push([+cv.t, +cv.value]);
                        break;
                    }
                    case CurvesHelper.PhysiologicalParamaters.NIBP: {
                        if (!this.nibpConfiguration) {
                            this.nibpConfiguration = {
                                label: cv.ppPerAs.physiologicalParameter.label,
                                unit: cv.ppPerAs.physiologicalParameter.unit,
                                alert_high: cv.ppPerAs.alert_high,
                                alert_low: cv.ppPerAs.alert_low,
                            };
                        }
                        this.nibpCurve.push([+cv.t, +cv.value]);
                        break;
                    }
                    case CurvesHelper.PhysiologicalParamaters.TEMP: {
                        this.temperature = {
                            value: +cv.value,
                            label: cv.ppPerAs.physiologicalParameter.label,
                            unit: cv.ppPerAs.physiologicalParameter.unit,
                            alert_high: cv.ppPerAs.alert_high,
                            alert_low: cv.ppPerAs.alert_low,
                        };
                        break;
                    }
                    case CurvesHelper.PhysiologicalParamaters.RESP: {
                        this.respFrequency = {
                            value: +cv.value,
                            label: cv.ppPerAs.physiologicalParameter.label,
                            unit: cv.ppPerAs.physiologicalParameter.unit,
                            alert_high: cv.ppPerAs.alert_high,
                            alert_low: cv.ppPerAs.alert_low,
                        };
                        break;
                    }
                    case CurvesHelper.PhysiologicalParamaters.CARDIAC_FREQ: {
                        this.cardiacFrequency = {
                            value: +cv.value,
                            label: cv.ppPerAs.physiologicalParameter.label,
                            unit: cv.ppPerAs.physiologicalParameter.unit,
                            alert_high: cv.ppPerAs.alert_high,
                            alert_low: cv.ppPerAs.alert_low,
                        };
                        break;
                    }
                    default:
                        break;
                }
            });
            this.loadCuve();
            this.scaleCurves();
        }
        console.log(this.capnographyConfiguration);
        console.log(this.plethConfiguration);
    }

    /**
     * Scale curves according to physiological paramaters (Cardiac Freq and Resp Freq)
     */
    private scaleCurves(): void {
        // this.capnographyCurve = this.CurvesHelper.scaleCurve(
        //     this.capnographyCurve
        // );
    }

    /**
     * Load with dummy data
     * @todo delete it
     */
    private loadCuve() {
        this.nibpCurve = [
            [-100, -7.28568859177975],
            [-99.5, -10.308641686442629],
            [-99, -12.413148293738898],
            [-98.5, -13.515078781534513],
            [-98, -13.621163798783135],
            [-97.5, -12.823906192675082],
            [-97, -11.288665356829664],
            [-96.5, -9.23425907937281],
            [-96, -6.909008869380329],
            [-95.5, -4.564555818396275],
            [-95, -2.429959682553713],
            [-94.5, -0.6885479810639478],
            [-94, 0.5402906066423075],
            [-93.5, 1.21264800981265],
            [-93, 1.3638845704762748],
            [-92.5, 1.1043049945382515],
            [-92, 0.607128800864712],
            [-91.5, 0.08988902269203362],
            [-91, -0.2089830400941321],
            [-90.5, -0.05616574430357663],
            [-90, 0.7504337485361828],
            [-89.5, 2.357963053593699],
            [-89, 4.8396258541001735],
            [-88.5, 8.182302580101384],
            [-88, 12.28210110977527],
            [-87.5, 16.94843212511602],
            [-87, 21.916427041284017],
            [-86.5, 26.866748982321948],
            [-86, 31.45115851897577],
            [-85.5, 35.321648453659435],
            [-85, 38.160606043315696],
            [-84.5, 39.709329939589225],
            [-84, 39.792336052740495],
            [-83.5, 38.33522352984697],
            [-83, 35.37441051193005],
            [-82.5, 31.057742636470405],
            [-82, 25.635764735233245],
            [-81.5, 19.444258578788666],
            [-81, 12.879415101870299],
            [-80.5, 6.367660473015441],
            [-80, 0.33263375275288687],
            [-79.5, -4.837923076371445],
            [-79, -8.822578093923074],
            [-78.5, -11.391358995906408],
            [-78, -12.423514388716917],
            [-77.5, -11.916388761583795],
            [-77, -9.984670358500548],
            [-76.5, -6.850092793304596],
            [-76, -2.8224853658042144],
            [-75.5, 1.7261975266933924],
            [-75, 6.392644923935266],
            [-74.5, 10.775134678186568],
            [-74, 14.505865183234313],
            [-73.5, 17.279956480954215],
            [-73, 18.878712863643415],
            [-72.5, 19.185255699222136],
            [-72, 18.191313030152614],
            [-71.5, 15.994731145683359],
            [-71, 12.788083709042441],
            [-70.5, 8.83952449599976],
            [-70, 4.467692549018498],
            [-69.5, 0.012975590895437749],
            [-69, -4.1922741387420865],
            [-68.5, -7.851922117811794],
            [-68, -10.730163368329142],
            [-67.5, -12.669495084794402],
            [-67, -13.601062453462621],
            [-66.5, -13.5465994712637],
            [-66, -12.611959711686918],
            [-65.5, -10.97299885981492],
            [-65, -8.855262294629314],
            [-64.5, -6.509484909480171],
            [-64, -4.185277201955389],
            [-63.5, -2.105518924587793],
            [-63, -0.4438966754207421],
            [-62.5, 0.692286852115487],
            [-62, 1.2724079897455145],
            [-61.5, 1.3449501671845296],
            [-61, 1.0318351442775524],
            [-60.5, 0.5151905269770695],
            [-60, 0.017801185985999862],
            [-59.5, -0.22090709289360527],
            [-59, 0.028928422051093385],
            [-58.5, 0.9617190257942162],
            [-58, 2.713348257419601],
            [-57.5, 5.3431673515049924],
            [-57, 8.822875928469273],
            [-56.5, 13.03348526904271],
            [-56, 17.770830581210273],
            [-55.5, 22.759318555202444],
            [-55, 27.67283754054597],
            [-54.5, 32.1610885780304],
            [-54, 35.87907719610712],
            [-53.5, 38.51718597410974],
            [-53, 39.82915643467974],
            [-52.5, 39.65545557536569],
            [-52, 37.93987574464047],
            [-51.5, 34.737784778835895],
            [-51, 30.215157003198623],
            [-50.5, 24.638312364356967],
            [-50, 18.3551004804382],
            [-49.5, 11.769017244537302],
            [-49, 5.308367228986769],
            [-48.5, -0.6069701736010016],
            [-48, -5.598389007462409],
            [-47.5, -9.358254797929293],
            [-47, -11.673945378494896],
            [-46.5, -12.44420341716319],
            [-46, -11.68642247579883],
            [-45.5, -9.534261396568692],
            [-45, -6.225807256488313],
            [-44.5, -2.08331287986152],
            [-44, 2.5137494777176124],
            [-43.5, 7.160013600760711],
            [-43, 11.457257707042197],
            [-42.5, 15.04636057918079],
            [-42, 17.635494470616305],
            [-41.5, 19.022220309574532],
            [-41, 19.10769812254342],
            [-40.5, 17.901924909054376],
            [-40, 15.519701164991243],
            [-39.5, 12.16783590862111],
            [-39, 8.124856971095452],
            [-38.5, 3.7151319027968746],
            [-38, -0.7202306728773972],
            [-37.5, -4.853079136766696],
            [-37, -8.395881007451033],
            [-36.5, -11.124933349885053],
            [-36, -12.897138971827948],
            [-35.5, -13.658972761082097],
            [-35, -13.446987387978195],
            [-34.5, -12.379984634126401],
            [-34, -10.643737522168548],
            [-33.5, -8.469820815939153],
            [-33, -6.110632965724325],
            [-32.5, -3.81302424996074],
            [-32, -1.7930543977126796],
            [-31.5, -0.21427928123454362],
            [-31, 0.8283777214546426],
            [-30.5, 1.3176465270661046],
            [-30, 1.3149721422382217],
            [-29.5, 0.9535163621628415],
            [-29, 0.42375789153044796],
            [-28.5, -0.04695086970601061],
            [-28, -0.21893632662110582],
            [-27.5, 0.13346760225517343],
            [-27, 1.1963329846094723],
            [-26.5, 3.0937660296313783],
            [-26, 5.870948366027804],
            [-25.5, 9.484311863088184],
            [-25, 13.79992777928205],
            [-24.5, 18.60044702205284],
            [-24, 23.600146792414954],
            [-23.5, 28.466890368388025],
            [-23, 32.84915907101051],
            [-22.5, 36.40582759756618],
            [-22, 38.83607084270149],
            [-21.5, 39.90673883640768],
            [-21, 39.47472266749568],
            [-20.5, 37.50224316117999],
            [-20, 34.0635906227061],
            [-19.5, 29.34257625068219],
            [-19, 23.62075967148033],
            [-18.5, 17.257321645532187],
            [-18, 10.662185216671737],
            [-17.5, 4.264587283955446],
            [-17, -1.5202875629660895],
            [-16.5, -6.323814866394274],
            [-16, -9.852842017681294],
            [-15.5, -11.912562521377135],
            [-15, -12.421420510444117],
            [-14.5, -11.416790659702185],
            [-14, -9.050965359379433],
            [-13.5, -5.577808226132026],
            [-13, -1.3312284065670519],
            [-12.5, 3.3026758385509267],
            [-12, 7.917423620193896],
            [-11.5, 12.119203239280052],
            [-11, 15.55837638282317],
            [-10.5, 17.956796360351262],
            [-10, 19.12868503085732],
            [-9.5, 18.99338986202127],
            [-9, 17.579061587148733],
            [-8.5, 15.01709021482992],
            [-8, 11.527942043659884],
            [-7.5, 7.399781778875801],
            [-7, 2.9618766903727725],
            [-6.5, -1.4447894690655656],
            [-6, -5.497053399663779],
            [-5.5, -8.91664548985408],
            [-5, -11.492442353296507],
            [-4.5, -13.096007425735229],
            [-4, -13.689159299781739],
            [-3.5, -13.323045922867745],
            [-3, -12.128981716306324],
            [-2.5, -10.30205367796348],
            [-2, -8.079154145047465],
            [-1.5, -5.713593654471709],
            [-1, -3.448743016334093],
            [-0.5, -1.4932232631765217],
            [0, 0],
            [0.5, 0.9486397319584265],
            [1, 1.3488096893269022],
            [1.5, 1.2747170638693173],
            [2, 0.870353404927271],
            [2.5, 0.3339660345950574],
            [3, -0.10322470763397162],
            [3.5, -0.20204765659669835],
            [4, 0.2582374710442245],
            [4.5, 1.454725891649126],
            [5, 3.4992630153517794],
            [5.5, 6.422580567311993],
            [6, 10.165796338844878],
            [6.5, 14.580238819160703],
            [7, 19.435802797730613],
            [7.5, 24.437261127880166],
            [8, 29.24722169622069],
            [8.5, 33.513794004739815],
            [9, 36.900573657650156],
            [9.5, 39.11630758706193],
            [10, 39.941591483707086],
            [10.5, 39.25017620157846],
            [11, 37.022903312892616],
            [11.5, 33.35291338730777],
            [12, 28.44151963796814],
            [12.5, 22.58494859182894],
            [13, 16.152947095922325],
            [13.5, 9.560970707452038],
            [14, 3.238238801433192],
            [14.5, -2.4056842830906398],
            [15, -7.012978673567718],
            [15.5, -10.305624836117072],
            [16, -12.107056254092159],
            [16.5, -12.355580200073405],
            [17, -11.10843817373304],
            [17.5, -8.536176088592812],
            [18, -4.90782121466318],
            [18.5, -0.5681459110878003],
            [19, 4.091031098382733],
            [19.5, 8.663055207241856],
            [20, 12.759421640647318],
            [20.5, 16.040752592352533],
            [21, 18.243176576243357],
            [21.5, 19.197939288291717],
            [22, 18.842679990982205],
            [22.5, 17.223544347651067],
            [23, 14.488108235548665],
            [23.5, 10.86988618038699],
            [24, 6.6659221812418945],
            [24.5, 2.209546267783195],
            [25, -2.1592238447013776],
            [25.5, -6.122984088310804],
            [26, -9.413361256758252],
            [26.5, -11.832253816320339],
            [27, -13.266101020473464],
            [27.5, -13.692038393324927],
            [28, -13.175547760361352],
            [28.5, -11.859988828360883],
            [29, -9.949136490320415],
            [29.5, -7.684477199530865],
            [30, -5.319482513871472],
            [30.5, -3.0933368490897424],
            [31, -1.2066268829646725],
            [31.5, 0.1987000891124841],
            [32, 1.0532133853370986],
            [32.5, 1.3664018475405608],
            [33, 1.2249981140652904],
            [33.5, 0.7833810466567335],
            [34, 0.24696017979113305],
            [34.5, -0.1498891855695422],
            [35, -0.16925007139800816],
            [35.5, 0.4039734569218113],
            [36, 1.737283984396856],
            [36.5, 3.929813834125026],
            [37, 6.997602267276391],
            [37.5, 10.866447559164017],
            [38, 15.37317300071458],
            [38.5, 20.275381487984532],
            [39, 25.268995081304684],
            [39.5, 30.012154044519434],
            [40, 34.153449933416525],
            [40.5, 37.362044132215885],
            [41, 39.35701605241099],
            [41.5, 39.93331403791406],
            [42, 38.98194585746568],
            [42.5, 36.502522494982095],
            [43, 32.606917653346514],
            [43.5, 27.513569360946178],
            [44, 21.532762221559814],
            [44.5, 15.04401754771972],
            [45, 8.467414060409247],
            [45.5, 2.231202253174259],
            [46, -3.2615873259646198],
            [46.5, -7.664738112952494],
            [47, -10.715980079127142],
            [47.5, -12.257368751095374],
            [48, -12.247190107477518],
            [48.5, -10.762392147500078],
            [49, -7.991352244733339],
            [49.5, -4.217613972442744],
            [50, 0.20400418462188566],
            [50.5, 4.876880077839909],
            [51, 9.395124449081761],
            [51.5, 13.376421273233174],
            [52, 16.492404111543],
            [52.5, 18.494034773760912],
            [53, 19.22990353310072],
            [53.5, 18.656001240762667],
            [54, 16.836266627996974],
            [54.5, 13.934019969891603],
            [55, 10.195185607831574],
            [55.5, 5.924910825028729],
            [56, 1.4597454208423777],
            [56.5, -2.8620933688495294],
            [57, -6.729712922557857],
            [57.5, -9.885241147398862],
            [58, -12.144004442705404],
            [58.5, -13.40749282195799],
            [59, -13.668091400301305],
            [59.5, -13.005317296528741],
            [60, -11.574077708447874],
            [60.5, -9.586188374077032],
            [61, -7.28699674721417],
            [61.5, -4.929386789541986],
            [62, -2.747663831836344],
            [62.5, -0.9338091588054483],
            [63, 0.38164363608619517],
            [63.5, 1.142302663092698],
            [64, 1.3709841074751992],
            [64.5, 1.1666726035062154],
            [65, 0.6936609119957133],
            [65.5, 0.16389208586664838],
            [66, -0.18582804773230152],
            [66.5, -0.11958792315217186],
            [67, 0.5713580738956626],
            [67.5, 2.0443276909305883],
            [68, 4.385320374542261],
            [68.5, 7.595478879431859],
            [69, 11.585317583836206],
            [69.5, 16.177432003975525],
            [70, 21.117632346422035],
            [70.5, 26.093670276933018],
            [71, 30.760022354178012],
            [71.5, 34.76661989385577],
            [72, 37.78902591993554],
            [72.5, 39.557391519206995],
            [73, 39.88159291393935],
            [73.5, 38.670252311997615],
            [74, 35.94185467473224],
            [74.5, 31.826844943066902],
            [75, 26.56036723047081],
            [75.5, 20.46612073928973],
            [76, 13.932584913724465],
            [76.5, 7.383539732774445],
            [77, 1.2453162173977006],
            [77.5, -4.086488316022926],
            [78, -8.278033050158065],
            [78.5, -11.083377630925245],
            [79, -12.36353853437559],
            [79.5, -12.096849635887272],
            [80, -10.37975947481941],
            [80.5, -7.418013821074427],
            [81, -3.508992319114549],
            [81.5, 0.983279497595262],
            [82, 5.658302370713721],
            [82.5, 10.111887309003258],
            [83, 13.968771747749276],
            [83.5, 16.91232297515734],
            [84, 18.708856862379733],
            [84.5, 19.224586162676218],
            [85, 18.43386853040691],
            [85.5, 16.41819147255127],
            [86, 13.356141579952205],
            [86.5, 9.505386930309934],
            [87, 5.178385663170118],
            [87.5, 0.7140604782586624],
            [88, -3.5519974865612904],
            [88.5, -7.316138713800894],
            [89, -10.331566649107813],
            [89.5, -12.427404556274425],
            [90, -13.520327586597327],
            [90.5, -13.617862853500739],
            [91, -12.813227911493573],
            [91.5, -11.272350638002058],
            [92, -9.214421396127614],
            [92.5, -6.887907876479652],
            [93, -4.5443623106137405],
            [93.5, -2.4125343613659083],
            [94, -0.6752550400481316],
            [94.5, 0.5487174411715527],
            [95, 1.2161743368259692],
            [95.5, 1.3631725739539164],
            [96, 1.1006393533733236],
            [96.5, 0.6022782227915058],
            [97, 0.0859164667235129],
            [97.5, -0.20994348985294733],
            [98, -0.05214413451216387],
            [98.5, 0.761018385811453],
            [99, 2.3761100198305223],
            [99.5, 4.865611281247671],
            [100, 8.215603575381051],
        ];
        let rand = Math.floor(Math.random() * 10);
        this.nibpCurve.forEach((data: number[]) => {
            if (data[0]) this.ecgCurve.push([data[0] * rand, data[1] * rand]);
        });
    }

    /**
     * Add noise on capnography Curve
     */
    onAddNoiseCapnography() {
        this.capnographyCurve = this.capnographyCurve.concat(
            this.CurvesHelper.editX(this.capnographyCurve)
        );
    }

    /**
     * Add noise on NIBP curve
     */
    onAddNoiseNIBP() {
        this.nibpCurve = this.nibpCurve.concat(
            this.CurvesHelper.editX(this.nibpCurve)
        );
    }

    /**
     * Save simulation
     */
    private saveSimulation(): void {
        const simulationData = {
            name: this.formGroup.value.simulationName,
            description: this.formGroup.value.simulationDescription,
            animalSpecie: {
                id_as: this.formGroup.value.animalSpecie.id_as,
                name: this.formGroup.value.animalSpecie.name,
                description: this.formGroup.value.animalSpecie.description,
            },
            scenarios: this.scenariosSimulation,
        };

        // Create simulation
        if (!this.simulation) {
            this.simulationService.create(simulationData).subscribe(
                (data: any) => {
                    this.toast.toastrConfig.timeOut = 1000;
                    this.toast.toastrConfig.positionClass = "toast-bottom-left";
                    this.toast.toastrConfig.closeButton = true;
                    this.toast.success("Simulation saved!");
                    this.simulation = simulationData;
                    this.simulation.id_simulation = data.id_simulation;
                },
                (error: any) => {
                    this.toast.toastrConfig.timeOut = 1000;
                    this.toast.toastrConfig.positionClass = "toast-bottom-left";
                    this.toast.toastrConfig.closeButton = true;
                    this.toast.error("Error saving simulation");
                }
            );
        } else {
            // Edit simulation
            this.simulationService
                .updateById(this.simulation.id_simulation, simulationData)
                .subscribe(
                    () => {
                        this.toast.toastrConfig.timeOut = 1000;
                        this.toast.toastrConfig.positionClass =
                            "toast-bottom-left";
                        this.toast.toastrConfig.closeButton = true;
                        this.toast.success("Simulation saved!");
                    },
                    (error: any) => {
                        this.toast.toastrConfig.timeOut = 1000;
                        this.toast.toastrConfig.positionClass =
                            "toast-bottom-left";
                        this.toast.toastrConfig.closeButton = true;
                        this.toast.error("Error saving simulation");
                    }
                );
        }
    }

    getScenarios(scenarios: any): void {
        this.scenariosSimulation = scenarios;
        this.editScenario = this.scenariosSimulation[this.indexActive];
        this.activeScenario = this.scenariosSimulation[
            this.indexSimulationActive
        ];
        this.onLoadCurves();
    }

    getPosScenarios(pos: any): void {
        this.indexActive = pos.indexEdit;
        this.indexSimulationActive = pos.indexActive;
    }

    /**
     *  TrackByFn: Define como rastrear los cambios en los ítems utilizados en el *ngFor.
     *  Aumenta el rendimiento, ya que solo se vuelven a representar en el DOM los nodos
     *  que han sido actualizados.
     */
    trackByFnAnimalSpecies(index: number, name: AnimalSpeciesI): number {
        return name.id_as;
    }

    trackByFnMedications(index: number, name: MedicationI): number {
        return name.id_medication;
    }

    trackByFnArrhythmias(index: number, name: ArrhythmiaI): number {
        return name.id_arr;
    }

    trackByFnPathologies(index: number, name: PathologyI): number {
        return name.id_pat;
    }
}
