import { Component, OnInit } from '@angular/core';
import { PanelService } from '@app/control-panel/services/panel.service';
import { Arrhythmia } from '@app/models/arrhythmia';

@Component({
  selector: 'app-arrhythmia',
  templateUrl: './arrhythmia.component.html',
  styleUrls: ['./arrhythmia.component.css']
})
export class ArrhythmiaComponent implements OnInit {

  constructor(private panelService : PanelService) { }

  arrhythmias : Arrhythmia[];

  ngOnInit(): void {
    this.panelService.getArrhythmia()
      .subscribe((arrhythmias : Arrhythmia[]) => {
        this.arrhythmias = arrhythmias;
      })
  }

  trackByFn(index: number, name: Arrhythmia): number {
    return name.id_arr;
  }

}
