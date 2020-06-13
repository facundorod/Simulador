import { Component, OnInit } from '@angular/core';
import { PanelService } from '@app/control-panel/services/panel.service';
import { MedicationI } from '@app/models/medicationI';

@Component({
  selector: 'app-medication',
  templateUrl: './medication.component.html',
  styleUrls: ['./medication.component.css']
})
export class MedicationComponent implements OnInit {

  constructor(private panelService: PanelService) { }

  medications : MedicationI[];

  ngOnInit(): void {
    this.panelService.getMedication()
      .subscribe((medications : MedicationI[]) => {
        this.medications = medications;
      })
  }

  trackByFn(index: number, name: MedicationI): number {
    return name.id_medication;
  }
}
