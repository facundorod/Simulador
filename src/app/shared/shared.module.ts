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
import { TextOverflowPipe } from './pipes/text-overflow.pipe';
import { AudioPlayerService } from './services/audio-player.service';
import { SpinnerComponent } from './animations/spinner/spinner.component';

@NgModule({
    declarations: [
        SidebarComponent,
        MainTitleComponent,
        MessageComponent,
        ConfirmModalComponent,
        ArrayJsonPipe,
        AudioComponent,
        TextOverflowPipe,
        SpinnerComponent,
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
        TextOverflowPipe,
        AudioComponent,
        SpinnerComponent
    ],
    providers: [ApiService, AuthSession, LocalStorageService, AudioPlayerService],
})
export class SharedModule { }
