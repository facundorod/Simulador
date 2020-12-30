import { MedicationI } from './../../../../shared/models/medicationI';
import { Component, OnInit } from '@angular/core';
import { AbmService } from './../../../../services/abm.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medications',
  templateUrl: './medications.component.html',
  styleUrls: ['./medications.component.css']
})
export class MedicationsComponent implements OnInit {

  public medication : MedicationI;

  constructor(private abm:AbmService, private toast:ToastrService, private route:Router) { }

  ngOnInit(): void {
  }
  saveMedication (){
    this.abm.insertMedications (this.medication).subscribe (() =>{
      this.toast.success("The insert has been successful")
    })
  }
}
