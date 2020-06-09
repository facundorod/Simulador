import { Component, OnInit } from '@angular/core';
import { PanelService } from '@app/control-panel/services/panel.service';
import { Medication } from '@app/models/medication';

@Component({
  selector: 'app-medication',
  templateUrl: './medication.component.html',
  styleUrls: ['./medication.component.css']
})
export class MedicationComponent implements OnInit {

  constructor(private panelService: PanelService) { }

  medications : Medication[];

  ngOnInit(): void {
    this.panelService.getMedication()
      .subscribe((medications : Medication[]) => {
        this.medications = medications;
      })
  }

  trackByFn(index: number, name: Medication): number {
    return name.id_medication;
  }
}
