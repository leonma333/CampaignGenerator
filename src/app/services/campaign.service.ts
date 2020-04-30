import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

import { Campaign } from '../models/campaign';
import { CAMPAIGNS } from '../mocks/campaigns';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private campaigns: Campaign[];

  constructor() { 
    this.campaigns = CAMPAIGNS;
  }

  getCampaigns(): Campaign[] {
    return this.campaigns;
  }

  getCampaign(id: string): Campaign {
    return this.campaigns.find(c => c.id === id);
  }

  addCampaign(content: object): void {
    const newCampaign: Campaign = {
      id: uuidv4(),
      content: content
    };
    this.campaigns.push(newCampaign);
  }

  saveCampaign(campaign: Campaign): void {
    const index = this.campaigns.findIndex(c => c.id === campaign.id);
    this.campaigns[index] = campaign;
  }
}
