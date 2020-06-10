import { Component, OnInit } from '@angular/core';
import { PanelService } from '@app/control-panel/services/panel.service';
import { Pathology } from '@app/models/pathology';

@Component({
  selector: 'app-pathology',
  templateUrl: './pathology.component.html',
  styleUrls: ['./pathology.component.css']
})
export class PathologyComponent implements OnInit {

  pathologies : Pathology[];
  constructor(private panelSvc : PanelService) { }

  ngOnInit(): void {
    this.panelSvc.getPathology()
      .subscribe((pathologies : Pathology[]) => {
        this.pathologies = pathologies;
      })
  }

  trackByFn(index: number, name: Pathology): number {
    return name.id_pat;
  }

}
