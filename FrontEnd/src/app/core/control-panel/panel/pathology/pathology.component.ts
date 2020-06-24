import { Component, OnInit } from '@angular/core';
import { PanelService } from '@controlPanel/services/panel.service';
import { PathologyI } from '@models/pathologyI';

@Component({
  selector: 'app-pathology',
  templateUrl: './pathology.component.html',
  styleUrls: ['./pathology.component.css']
})
export class PathologyComponent implements OnInit {

  pathologies : PathologyI[];
  constructor(private panelSvc : PanelService) { }

  ngOnInit(): void {
    this.panelSvc.getPathology()
      .subscribe((pathologies : PathologyI[]) => {
        this.pathologies = pathologies;
      })
  }

  trackByFn(index: number, name: PathologyI): number {
    return name.id_pat;
  }

}
