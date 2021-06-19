import { Component, Input, OnInit, TrackByFunction } from '@angular/core';
import { CurvesI } from '@app/shared/models/curvesI';
import { NgxEchartsDirective } from 'ngx-echarts';
import { CurvesHelper } from '../../helpers/curvesHelper';

@Component({
    selector: 'app-simulator',
    templateUrl: './simulator.component.html',
    styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent implements OnInit {

    @Input() curves: CurvesI[];
    @Input() sampleFrequency: number;
    @Input() clockMonitor: number;
    private simulationTimer: NodeJS.Timeout;
    private curvesHelper: CurvesHelper = new CurvesHelper();

    public chartOptions: NgxEchartsDirective["initOpts"] = {
        height: 180,
        width: 1180,
    };
    private clockTimer: number;
    public trackByFn: TrackByFunction<CurvesI> = (_, curve: CurvesI) => curve.curveConfiguration.id_pp;

    constructor() {
        this.clockTimer = this.sampleFrequency * this.clockMonitor;
    }

    ngOnInit(): void {
        this.simulationTimer = setInterval(() => {

        }, this.clockTimer);
    }

    public getMaxY(curveValues: number[][]): number {
        return this.curvesHelper.getMaxY(curveValues);
    }

    public getMinY(curveValues: number[][]): number {
        return this.curvesHelper.getMinY(curveValues);
    }

}
