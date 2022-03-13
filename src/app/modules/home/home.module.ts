import { SharedModule } from './../../shared/shared.module';
import { AppModule } from '@app/app.module';
import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ManualComponent } from './manual/manual.component';



@NgModule({
    declarations: [HomeComponent, ManualComponent],
    imports: [
        SharedModule,
        HomeRoutingModule,
        PdfViewerModule
    ],
    exports: [HomeComponent]
})
export class HomeModule { }
