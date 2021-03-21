import { SharedModule } from './../../shared/shared.module';
import { AppModule } from '@app/app.module';
import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';



@NgModule({
  declarations: [HomeComponent],
  imports: [
    SharedModule,
    HomeRoutingModule,
  ],
  exports: [HomeComponent]
})
export class HomeModule { }
