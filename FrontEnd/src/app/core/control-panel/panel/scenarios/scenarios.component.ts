import { Component, OnInit } from '@angular/core';
import { PanelService } from '@controlPanel/services/panel.service';
import { ScenarioI } from '@models/scenarioI';

@Component({
  selector: 'app-scenarios',
  templateUrl: './scenarios.component.html',
  styleUrls: ['./scenarios.component.css']
})
export class ScenariosComponent implements OnInit {
  scenarios : ScenarioI[];

  constructor(private panelService: PanelService) { }

  ngOnInit(): void {
    this.panelService.getScenarios()
      .subscribe((scenarios : ScenarioI[] ) => {
        this.scenarios = scenarios;
      })
  }

  trackByFn(index: number, name: ScenarioI): number {
    return name.id_scenario;
  }



}
