import { ScenarioService } from './../../../control-panel/services/scenario.service';
import { SimulationsComponent } from './../../modals/simulations/simulations.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from './../../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SimulationService } from '../../services/simulation.service';
import { AuthService } from '@app/services/auth.service';

@Component({
    selector: 'app-new',
    templateUrl: './new.component.html',
    styleUrls: ['./new.component.css'],
})
export class NewComponent implements OnInit {
    option: any;
    simulations: any[];

    constructor(
        private router: Router,
        private modal: NgbModal,
        private simulationService: SimulationService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
    }

    initiateSimulation(): void {
        // TODO: Change this logic to reactive forms.
        const simulation = localStorage.getItem('Simulation');

        if (this.option === 'blank') {
            this.router.navigateByUrl('/panel/scenarios');

            if (simulation) { localStorage.removeItem('Simulation'); }
        } else {
            if (this.option === 'previous') {
                const modal = this.modal.open(SimulationsComponent, {size: 'lg', windowClass: 'modal-small'});
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
                        if (simulation) {
                            localStorage.setItem(
                                'Simulation',
                                JSON.stringify(simulation)
                            );
                            this.router.navigateByUrl('/panel');
                        }
                    },
                    (error: any) => {
                        console.log(error);
                    }
                );
            } else {
                this.router.navigateByUrl('/panel');
            }
        }
    }

    public isUserAdmin(): boolean {
        return this.authService.isAdmin();
    }
}
