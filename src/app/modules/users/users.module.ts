import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UsersRoutingModule } from "./users-routing.module";
import { MyProfileComponent } from "./my-profile/my-profile.component";
import { UserService } from "./services/user.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChangePasswordComponent } from './modals/change-password/change-password.component';
import { UsersListComponent } from './users-list/users-list.component';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "@app/shared/shared.module";
import { EditUserComponent } from './modals/edit-user/edit-user.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
    declarations: [MyProfileComponent, ChangePasswordComponent, UsersListComponent, EditUserComponent],
    imports: [
        CommonModule,
        UsersRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgMultiSelectDropDownModule.forRoot(),
        NgbModule,
        SharedModule
    ],
    providers: [UserService],
})
export class UsersModule { }
