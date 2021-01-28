import { ScenarioService } from "./../../../control-panel/services/scenario.service";
import { ScenariosComponent } from "../../modals/scenarios/scenarios.component";
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
    option: any;
    simulations: any[];

    constructor(
        private router: Router,
        private modal: NgbModal,
        private simulationService: SimulationService,
        private scenarioService: ScenarioService
    ) {}

    ngOnInit(): void {
        // window.open(environment.simulation, "_blank");
    }

    initiateSimulation(): void {
        // TODO: Change this logic to reactive forms.
        const simulation = localStorage.getItem("Simulation");
        const scenario = localStorage.getItem("Scenario");
        if (this.option === "blank") {
            this.router.navigateByUrl("/panel");

            if (simulation) localStorage.removeItem("Simulation");
            if (scenario) localStorage.removeItem("Scenario");
        } else {
            if (this.option === "previous") {
                if (scenario) localStorage.removeItem("Scenario");
                const modal = this.modal.open(SimulationsComponent);
                this.simulationService.list().subscribe(
                    (simulations: any) => {
                        this.simulations = simulations.data;
                        modal.componentInstance.setSimulations(
                            simulations.data
                        );
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

            if (this.option === "previousScenario") {
                const modal = this.modal.open(ScenariosComponent);
                this.scenarioService.list(null, null).subscribe(
                    (scenarios: any) => {
                        modal.componentInstance.setScenarios(scenarios.data);
                    },
                    (error: any) => {
                        console.log(error);
                    }
                );
                if (simulation) localStorage.removeItem("Simulation");

                modal.result.then((scenario: any) => {
                    if (scenario) {
                        localStorage.setItem(
                            "Scenario",
                            JSON.stringify(scenario)
                        );
                        this.router.navigateByUrl("/panel");
                    }
                });
            }
        }
    }
}
