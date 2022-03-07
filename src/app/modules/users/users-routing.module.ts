import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminGuard } from "@app/guards/admin.guard";
import { MyProfileComponent } from "./my-profile/my-profile.component";
import { UsersListComponent } from "./users-list/users-list.component";

const routes: Routes = [
    { path: "my-profile", component: MyProfileComponent },
    { path: '', canActivate: [AdminGuard], component: UsersListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UsersRoutingModule { }
