
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';




const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'auth', loadChildren: () => import('@auth/authorization.module').then(m => m.AuthorizationModule) },
  { path: 'home', loadChildren: () => import('@home/home.module').then(m => m.HomeModule) },
  {
    path: 'panel',
    canActivate: [AuthGuard],
    loadChildren: () => import('@controlPanel/control-panel.module').then(m => m.ControlPanelModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
