import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent }   from './components/dashboard/dashboard.component';
import { NewCampaignComponent } from './components/new-campaign/new-campaign.component';
import { EditCampaignComponent } from './components/edit-campaign/edit-campaign.component';
import { ViewCampaignComponent } from './components/view-campaign/view-campaign.component';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'new', component: NewCampaignComponent},
    { path: 'edit/:id', component: EditCampaignComponent},
    { path: 'view/:id', component: ViewCampaignComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
