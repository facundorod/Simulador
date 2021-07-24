import { Component, Input, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { CurvesI } from '@app/shared/models/curvesI';
import { Monitor } from '@app/shared/models/monitor';
import { StatesI } from '@app/shared/models/stateI';


@Component({
    selector: 'app-simulator',
    templateUrl: './simulator.component.html',
    styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent implements OnInit, OnDestroy {

    @Input() curves: StatesI;
    @Input() stop: boolean;
    public monitorConfiguration: Monitor = new Monitor();



    public trackByFn: TrackByFunction<CurvesI> = (_, curve: CurvesI) => curve.curveConfiguration.id_pp;
    constructor() { }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }


}
