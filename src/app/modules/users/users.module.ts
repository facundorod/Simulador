import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UsersRoutingModule } from "./users-routing.module";
import { MyProfileComponent } from "./my-profile/my-profile.component";
import { UserService } from "./services/user.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChangePasswordComponent } from './modals/change-password/change-password.component';

@NgModule({
    declarations: [MyProfileComponent, ChangePasswordComponent],
    imports: [
        CommonModule,
        UsersRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [UserService],
})
export class UsersModule {}
