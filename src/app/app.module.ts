import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { QuillModule } from 'ngx-quill';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewCampaignComponent } from './components/new-campaign/new-campaign.component';
import { EditCampaignComponent } from './components/edit-campaign/edit-campaign.component';
import { HeaderComponent } from './components/header/header.component';
import { DashboardPreviewComponent } from './components/dashboard-preview/dashboard-preview.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NewCampaignComponent,
    EditCampaignComponent,
    HeaderComponent,
    DashboardPreviewComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    QuillModule.forRoot(),
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
