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

  getAll(): Campaign[] {
    return this.campaigns;
  }

  byId(id: string): Campaign {
    return this.campaigns.find(c => c.id === id);
  }

  add(name: string, content: object): void {
    const newCampaign: Campaign = {
      id: uuidv4(),
      name: name,
      content: content
    };
    this.campaigns.push(newCampaign);
  }

  save(campaign: Campaign): void {
    const index = this.campaigns.findIndex(c => c.id === campaign.id);
    this.campaigns[index] = campaign;
  }

  delete(id: string): void {
    this.campaigns = this.campaigns.filter(c => c.id !== id);
  }
}
