import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ViewCampaignComponent } from './components/view-campaign/view-campaign.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from './components/shared/modal-confirm/modal-confirm.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NewCampaignComponent,
    EditCampaignComponent,
    HeaderComponent,
    DashboardPreviewComponent,
    ViewCampaignComponent,
    ModalConfirmComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    QuillModule.forRoot(),
    FontAwesomeModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
