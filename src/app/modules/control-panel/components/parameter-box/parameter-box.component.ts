import { Component, Input, OnInit } from '@angular/core';
import { PhysiologicalParamaterI } from '@app/shared/models/physiologicalParamaterI';
import { CurvesService } from '../../services/curves.service';

@Component({
    selector: 'app-parameter-box',
    templateUrl: './parameter-box.component.html',
    styleUrls: ['./parameter-box.component.css']
})
export class ParameterBoxComponent implements OnInit {

    @Input() parameter: PhysiologicalParamaterI;
    constructor() { }

    ngOnInit(): void {
    }

}
