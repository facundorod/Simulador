import { Component, OnInit } from '@angular/core';
import { PanelService } from '@controlPanel/services/panel.service';
import { ArrhythmiaI } from '@models/arrhythmiaI';

@Component({
  selector: 'app-arrhythmia',
  templateUrl: './arrhythmia.component.html',
  styleUrls: ['./arrhythmia.component.css']
})
export class ArrhythmiaComponent implements OnInit {

  constructor(private panelService : PanelService) { }

  arrhythmias : ArrhythmiaI[];

  ngOnInit(): void {
    this.panelService.getArrhythmia()
      .subscribe((arrhythmias : ArrhythmiaI[]) => {
        this.arrhythmias = arrhythmias;
      })
  }

  trackByFn(index: number, name: ArrhythmiaI): number {
    return name.id_arr;
  }

}
