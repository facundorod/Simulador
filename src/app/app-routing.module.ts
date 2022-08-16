import { PanelLayoutComponent } from "./shared/layouts/panelLayout/panel-layout.component";
import { MainComponent } from "./shared/layouts/main/main.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "@guards/auth.guard";
import { SimulationLayoutComponent } from "./shared/layouts/simulationLayout/simulation-layout.component";
import { LoginGuard } from "./guards/login.guard";
import { NewComponent } from "./shared/layouts/new/new.component";
import { ManualComponent } from "./modules/home/manual/manual.component";

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
                canActivate: [LoginGuard],
                loadChildren: () =>
                    import("@home/home.module").then((m) => m.HomeModule),
            },
        ],
    },
    {
        path: "manual",
        component: ManualComponent
    },
    {
        path: "panel",
        canActivate: [AuthGuard],
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
        path: "users",
        canActivate: [AuthGuard],
        component: PanelLayoutComponent,
        children: [
            {
                path: "",
                loadChildren: () =>
                    import("../app/modules/users/users.module").then(
                        (m) => m.UsersModule
                    ),
            },
        ],
    },
    {
        path: "simulation",
        component: NewComponent,
        canActivate: [AuthGuard],
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
    {
        path: "monitor",
        component: SimulationLayoutComponent,
        children: [
            {
                path: "",
                loadChildren: () =>
                    import("./modules/monitor/monitor.module").then(
                        (m) => m.MonitorModule
                    ),

            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
