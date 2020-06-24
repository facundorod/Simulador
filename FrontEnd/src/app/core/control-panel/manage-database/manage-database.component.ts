import { Component, OnInit } from '@angular/core';
import { PanelService } from '../services/panel.service';

@Component({
  selector: 'app-manage-database',
  templateUrl: './manage-database.component.html',
  styleUrls: ['./manage-database.component.css']
})
export class ManageDatabaseComponent implements OnInit {

  constructor(private panelSvc: PanelService) { }

  ngOnInit(): void {
  }

  insertAnimalSpecie(){
    this.panelSvc.insertAnimalSpecies().subscribe();

  }

}
