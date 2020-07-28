import { ArrhythmiaI } from '@models/arrhythmiaI';
import { Component, OnInit } from '@angular/core';
import { AbmService } from '@app/core/services/abm.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-arrhythmias',
  templateUrl: './arrhythmias.component.html',
  styleUrls: ['./arrhythmias.component.css']
})
export class ArrhythmiasComponent implements OnInit {

  public arrhythmia : ArrhythmiaI;

  constructor(private abm:AbmService, private toast:ToastrService, private route:Router) { }

  ngOnInit(): void {
  }

  saveArrhythmia(){
    this.abm.insertArrhythmias(this.arrhythmia).subscribe(()=>{
      this.toast.success("The insert has been successful")
    })
  }
}
