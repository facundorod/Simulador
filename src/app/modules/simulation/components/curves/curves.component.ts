import { Component, OnInit, Input } from "@angular/core";
import { EChartsOption } from "echarts";
import { ChartConfigurer } from "../../helpers/chartConfigurer";

@Component({
    selector: "app-curves",
    templateUrl: "./curves.component.html",
    styleUrls: ["./curves.component.css"],
})
export class CurvesComponent implements OnInit {
    @Input() curves: any[];
    chartOption: EChartsOption;
    constructor() {
        // this.chartOption = new ChartConfigurer(curves);
    }

    ngOnInit(): void {}
}
