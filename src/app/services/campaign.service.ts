import { Injectable } from '@angular/core';

import { Campaign } from '../models/campaign';
import { CAMPAIGNS } from '../mocks/campaigns';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private campaigns: Campaign[] = [];

  constructor() { 
    this.campaigns = CAMPAIGNS;
  }

  getCampaigns(): Campaign[] {
    console.log(this.campaigns.length);
    return this.campaigns;
  }

  addCampaign(content: object) {
    const newCampaign: Campaign = {
      id: 1,
      content: content
    };
    this.campaigns.push(newCampaign);
  }
}
