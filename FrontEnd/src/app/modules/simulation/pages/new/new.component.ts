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
    blank: boolean = false;
    previous: boolean = false;
    simulations: any[];

    constructor(
        private router: Router,
        private modal: NgbModal,
        private simulationService: SimulationService
    ) {}

    ngOnInit(): void {
        // window.open(environment.simulation, "_blank");
    }

    initiateSimulation(): void {
        // TODO: Change this logic to reactive forms.
        if (this.blank) {
            this.router.navigateByUrl("/panel");
        } else {
            const modal = this.modal.open(SimulationsComponent);
            this.simulationService.list().subscribe(
                (simulations: any) => {
                    this.simulations = simulations.data;
                    modal.componentInstance.setSimulations(simulations.data);
                },
                (error: any) => {
                    console.log(error);
                }
            );

            modal.result.then(
                (simulation: any) => {
                    if (simulation)
                        localStorage.setItem(
                            "Simulation",
                            JSON.stringify(simulation)
                        );
                },
                (error: any) => {
                    console.log(error);
                }
            );
        }
    }
}
