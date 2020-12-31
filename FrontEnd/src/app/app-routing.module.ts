import { PanelLayoutComponent } from "./shared/layouts/panelLayout/panel-layout.component";
import { MainComponent } from "./shared/layouts/main/main.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "@guards/auth.guard";

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    {
        path: "auth",
        component: MainComponent,
        children: [
            {
                path: "",
                loadChildren: () =>
                    import("@auth/authorization.module").then(
                        (m) => m.AuthorizationModule
                    ),
            },
        ],
    },
    {
        path: "home",
        component: MainComponent,
        children: [
            {
                path: "",
                loadChildren: () =>
                    import("@home/home.module").then((m) => m.HomeModule),
            },
        ],
    },
    {
        path: "panel",
        // canActivate: [AuthGuard],
        component: PanelLayoutComponent,
        children: [
            {
                path: "",
                loadChildren: () =>
                    import("@controlPanel/control-panel.module").then(
                        (m) => m.ControlPanelModule
                    ),
            },
        ],
    },
    {
        path: "simulation",
        component: PanelLayoutComponent,
        children: [
            {
                path: "",
                loadChildren: () =>
                    import("./modules/simulation/simulation.module").then(
                        (m) => m.SimulationModule
                    ),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
