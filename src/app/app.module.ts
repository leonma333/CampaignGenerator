import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { QuillModule } from 'ngx-quill';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewCampaignComponent } from './components/new-campaign/new-campaign.component';
import { EditCampaignComponent } from './components/edit-campaign/edit-campaign.component';
import { HeaderComponent } from './components/header/header.component';
import { DashboardPreviewComponent } from './components/dashboard-preview/dashboard-preview.component';
import { ViewCampaignComponent } from './components/view-campaign/view-campaign.component';
import { ModalConfirmComponent } from './components/shared/modal-confirm/modal-confirm.component';
import { SchedulePickerComponent } from './components/shared/schedule-picker/schedule-picker.component';
import { QuillComponent } from './components/shared/quill/quill.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NewCampaignComponent,
    EditCampaignComponent,
    HeaderComponent,
    DashboardPreviewComponent,
    ViewCampaignComponent,
    ModalConfirmComponent,
    SchedulePickerComponent,
    QuillComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    QuillModule.forRoot(),
    FontAwesomeModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
