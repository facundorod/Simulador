import { AuthSession } from './services/authSession.service';
import { ConfirmModalComponent } from './modals/confirm/confirm-modal.component';
import { MessageComponent } from './components/message/message.component';
import { MainTitleComponent } from './layouts/main-title/main-title.component';
import { ApiService } from './services/api.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '@app/shared/sidebar/sidebar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'ng-sidebar';
import { ArrayJsonPipe } from './pipes/array-json.pipe';
import { LocalStorageService } from './services/localStorage.service';
import { AudioComponent } from './components/audio/audio.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ScenarioTextPipe } from './pipes/scenario-text.pipe';

@NgModule({
    declarations: [
        SidebarComponent,
        MainTitleComponent,
        MessageComponent,
        ConfirmModalComponent,
        ArrayJsonPipe,
        AudioComponent,
        ScenarioTextPipe,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        SidebarModule.forRoot(),
        NgbModule,
    ],
    exports: [
        SidebarComponent,
        MainTitleComponent,
        MessageComponent,
        ConfirmModalComponent,
        ArrayJsonPipe,
        ScenarioTextPipe,
        AudioComponent
    ],
    providers: [ApiService, AuthSession, LocalStorageService],
})
export class SharedModule { }
