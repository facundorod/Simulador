import { SimulationsComponent } from "./../../modals/simulations/simulations.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "./../../../../../environments/environment";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SimulationService } from "../../services/simulation.service";

@Component({
    selector: "app-new",
    templateUrl: "./new.component.html",
    styleUrls: ["./new.component.css"],
})
export class NewComponent implements OnInit {
    blank: boolean;
    simulations: any[];

    constructor(
        private router: Router,
        private modal: NgbModal,
        private simulationService: SimulationService
    ) {}

    ngOnInit(): void {
        window.open(environment.simulation, "_blank");
    }

    initiateSimulation(): void {
        if (this.blank) {
            this.router.navigateByUrl("/panel");
        } else {
            // Pop UP con simulaciones de la base
            const modal = this.modal.open(SimulationsComponent);
            this.simulationService.list().subscribe(
                (simulations: []) => {
                    this.simulations = simulations;
                },
                (error: any) => {
                    console.log(error);
                }
            );

            if (this.simulations)
                modal.componentInstance.setSimulations(this.simulations);

            modal.result.then((simulation: any) => {
                console.log(simulation);
            });
        }
    }
}
