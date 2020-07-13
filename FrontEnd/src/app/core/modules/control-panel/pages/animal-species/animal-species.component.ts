import { Component, OnInit } from '@angular/core';
import { AbmService } from '@services/abm.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-animal-species',
  templateUrl: './animal-species.component.html',
  styleUrls: ['./animal-species.component.css']
})
export class AnimalSpeciesComponent implements OnInit {
  public nameAnimal:string;
  public weight:string;
  public description:string;
  constructor(private abm:AbmService, private toast:ToastrService, private router:Router) { }

  ngOnInit(): void {
  }
  saveAnimal(){

    this.toast.toastrConfig.timeOut = 1000;
    this.toast.toastrConfig.positionClass = "toast-bottom-full-width";
    this.abm.insertAnimalSpecies(this.nameAnimal).subscribe( () => {
      console.log("lo que me pinte");
       this.toast.success("The insert has been successful"); // ver

    })

  }
}
