import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ScenarioService } from "../../services/scenario.service";

@Component({
    selector: "app-scenario-params",
    templateUrl: "./scenario-params.component.html",
    styleUrls: ["./scenario-params.component.css"],
})
export class ScenarioParamsComponent implements OnInit {
    constructor(
        private scenarioService: ScenarioService,
        private fb: FormBuilder
    ) {}
    public scenarios: any;
    private formGroup: FormGroup;

    public paginatorData: {
        totalPages: number;
        itemsPerPage: number;
    };

    private loading: boolean = true;
    public queryOptions = {
        pageSize: 5,
        page: 1,
    };

    private order = {
        orderBy: "updatedAt",
        order: "asc",
    };

    ngOnInit(): void {
        this.initFormGroup();
        this.loadData();
    }

    public loadData(q: string = null): void {
        this.scenarioService
            .listWithParams(
                {
                    page: this.queryOptions.page,
                    pageSize: this.queryOptions.pageSize,
                    q: q ? q : this.formGroup.get("q").value,
                },
                this.order
            )
            .subscribe(
                (scenarios) => {
                    if (scenarios.data) {
                        this.paginatorData = {
                            totalPages: scenarios.total,
                            itemsPerPage: scenarios.per_page,
                        };
                        this.scenarios = scenarios.data;
                    }
                    this.loading = false;
                },
                (error: Error) => {
                    this.loading = false;
                    console.error(error);
                }
            );
    }

    public isLoading(): boolean {
        return this.loading;
    }

    public onPageChange(): void {
        this.loading = true;
        this.loadData();
    }

    private initFormGroup() {
        this.formGroup = this.fb.group({
            q: [""],
        });
        this.formGroup.get("q").valueChanges.subscribe((newValue) => {
            this.loading = true;
            this.loadData(newValue);
        });
    }

    public getFormGroup(): FormGroup {
        return this.formGroup;
    }

    public clearSearch(): void {
        this.formGroup.get("q").reset();
        this.loading = true;
        this.loadData();
    }
}
