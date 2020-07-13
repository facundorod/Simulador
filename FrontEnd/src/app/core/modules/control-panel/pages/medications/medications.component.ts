import { Component, OnInit } from '@angular/core';
import { AbmService } from '@app/core/services/abm.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medications',
  templateUrl: './medications.component.html',
  styleUrls: ['./medications.component.css']
})
export class MedicationsComponent implements OnInit {
  public medicationName:string;
  public description:string;
  constructor(private abm:AbmService, private toast:ToastrService, private route:Router) { }

  ngOnInit(): void {
  }
  saveMedication (){
    this.abm.insertMedications (this.medicationName, this.description).subscribe (() =>{
      this.toast.success("The insert has been successful")
    })
  }
}
