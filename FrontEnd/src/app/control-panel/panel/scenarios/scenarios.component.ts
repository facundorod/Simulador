import { Component, OnInit } from '@angular/core';
import { PanelService } from '@app/control-panel/services/panel.service';
import { Scenario } from '@app/models/scenario';

@Component({
  selector: 'app-scenarios',
  templateUrl: './scenarios.component.html',
  styleUrls: ['./scenarios.component.css']
})
export class ScenariosComponent implements OnInit {
  scenarios : Scenario[];

  constructor(private panelService: PanelService) { }

  ngOnInit(): void {
    this.panelService.getScenarios()
      .subscribe((scenarios : Scenario[]) => {
        this.scenarios = scenarios;
      })
  }

  trackByFn(index: number, name: Scenario): number {
    return name.id_scenario;
  }



}
