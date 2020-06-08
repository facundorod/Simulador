import { Component, OnInit } from '@angular/core';
import { PanelService } from '@app/control-panel/services/panel.service';

@Component({
  selector: 'app-scenarios',
  templateUrl: './scenarios.component.html',
  styleUrls: ['./scenarios.component.css']
})
export class ScenariosComponent implements OnInit {
  scenarios : any;

  constructor(private panelService: PanelService) { }

  ngOnInit(): void {
    this.panelService.getScenarios()
      .subscribe(scenarios => {
        this.scenarios = scenarios;
      })
  }



}
