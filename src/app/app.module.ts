import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { QuillModule } from 'ngx-quill';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewCampaignComponent } from './components/new-campaign/new-campaign.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NewCampaignComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    QuillModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
