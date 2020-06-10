import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { QuillModule } from 'ngx-quill';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './components/login/login.component';
import { DigitOnlyDirective } from './directives/digit-only.directive';
import { HeaderComponent } from './components/header/header.component';
import { QuillComponent } from './components/shared/quill/quill.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewCampaignComponent } from './components/new-campaign/new-campaign.component';
import { EditCampaignComponent } from './components/edit-campaign/edit-campaign.component';
import { ViewCampaignComponent } from './components/view-campaign/view-campaign.component';
import { DemographicsComponent } from './components/shared/demographics/demographics.component';
import { ModalConfirmComponent } from './components/shared/modal-confirm/modal-confirm.component';
import { DashboardPreviewComponent } from './components/dashboard-preview/dashboard-preview.component';
import { SchedulePickerComponent } from './components/shared/schedule-picker/schedule-picker.component';
import { DashboardPaginationComponent } from './components/dashboard-pagination/dashboard-pagination.component';

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
    QuillComponent,
    NotFoundComponent,
    DashboardPaginationComponent,
    DemographicsComponent,
    DigitOnlyDirective,
    LoginComponent
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
    AngularFirestoreModule,
    AngularFireAuthModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
