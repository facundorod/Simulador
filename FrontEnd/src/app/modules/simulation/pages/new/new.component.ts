import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {
  blank: boolean;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  initiateSimulation() : void {
    if ( this.blank ) {
      this.router.navigateByUrl('/panel');
    } else {
      // Pop UP con simulaciones de la base
      console.log("Aa");
    }

  }
}
