import { Component, OnInit } from "@angular/core";
import { CurvesService } from "@app/modules/control-panel/services/curves.service";
import { PhysiologicalParamaterI } from "@app/shared/models/PhysiologicalParamaterI";
import * as CurvesHelper from "./../../../simulation/helpers/curvesHelper";
import { BaseComponent } from "@app/shared/components/base.component";
import { FormBuilder } from "@angular/forms";

@Component({
    selector: "app-simulator",
    templateUrl: "./simulator.component.html",
    styleUrls: ["./simulator.component.css"],
})
export class SimulatorComponent extends BaseComponent implements OnInit {
    public capnographyCurve: number[][] = new Array(new Array());
    public ecgCurve: number[][] = new Array(new Array());
    public plethysmographyCurve: number[][] = new Array(new Array());
    public nibpCurve: number[][] = new Array(new Array());
    public ibpCurve: number[][] = new Array(new Array());
    public heartRate: number = 60;
    public curves: any[];
    public dummyCurve: number[][] = [
        [0, 1],
        [2, 3],
    ];
    public today: Date = new Date();
    public CurvesHelper = new CurvesHelper.CurvesHelper();

    constructor(private curvesService: CurvesService, private fb: FormBuilder) {
        super();
        this.loadECGCurve();
        this.curvesService
            .findAll({
                animalSpecie: 1,
                scenario: 1,
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
    }

    ngOnInit(): void {
        this.initFormGroup();
    }

    setCurves() {
        this.curves.forEach((cv: any) => {
            const physiologicalParameter: PhysiologicalParamaterI =
                cv.ppPerAs.physiologicalParameter;
            switch (physiologicalParameter.label.toUpperCase()) {
                case CurvesHelper.PhysiologicalParamaters.SPO2: {
                    this.plethysmographyCurve.push([+cv.t, +cv.value]);
                    break;
                }
                case CurvesHelper.PhysiologicalParamaters.ETCO2: {
                    this.capnographyCurve.push([+cv.t, +cv.value]);
                    break;
                }
                case CurvesHelper.PhysiologicalParamaters.ECG: {
                    this.ecgCurve.push([+cv.t, +cv.value]);
                    break;
                }
                case CurvesHelper.PhysiologicalParamaters.IBP: {
                    this.ibpCurve.push([+cv.t, +cv.value]);
                    break;
                }
                case CurvesHelper.PhysiologicalParamaters.NIBP: {
                    this.nibpCurve.push([+cv.t, +cv.value]);
                    break;
                }

                default:
                    break;
            }
        });
    }

    /**
     * Initialize the reactive form
     */
    private initFormGroup() {
        this.setSubmitForm(false);
        this.formGroup = this.fb.group({});
    }

    loadECGCurve() {
        this.ecgCurve = [
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
        ];
    }
}
