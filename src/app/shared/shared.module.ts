import { AuthSession } from "./services/authSession.service";
import { ConfirmModalComponent } from "./modals/confirm/confirm-modal.component";
import { MessageComponent } from "./components/message/message.component";
import { MainTitleComponent } from "./layouts/main-title/main-title.component";
import { ApiService } from "./services/api.service";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { NavbarComponent } from "@app/shared/navbar/navbar.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SidebarModule } from "ng-sidebar";
import { ArrayJsonPipe } from "./pipes/array-json.pipe";
import { LocalStorageService } from "./services/localStorage.service";
import { AudioComponent } from './components/audio/audio.component';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
    declarations: [
        NavbarComponent,
        MainTitleComponent,
        MessageComponent,
        ConfirmModalComponent,
        ArrayJsonPipe,
        AudioComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        SidebarModule.forRoot(),
        NgbModule,
    ],
    exports: [
        NavbarComponent,
        MainTitleComponent,
        MessageComponent,
        ConfirmModalComponent,
        ArrayJsonPipe,
        AudioComponent
    ],
    providers: [ApiService, AuthSession, LocalStorageService],
})
export class SharedModule { }
