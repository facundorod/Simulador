import { PathologyI } from './../../../../../shared/models/pathologyI';
import { Component, OnInit } from '@angular/core';
import { AbmService } from '@app/core/services/abm.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pathologies',
  templateUrl: './pathologies.component.html',
  styleUrls: ['./pathologies.component.css']
})
export class PathologiesComponent implements OnInit {

  public pathology : PathologyI;

  constructor(private abm:AbmService, private toast:ToastrService, private route:Router) { }

  ngOnInit(): void {
  }

  savePathologie (){
    this.abm.insertPathologies (this.pathology).subscribe( () => {
      this.toast.success("The insert has been successful")
    })
  }

}
