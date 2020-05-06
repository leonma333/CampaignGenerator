import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

import { Campaign } from '../models/campaign';
import { CAMPAIGNS } from '../mocks/campaigns';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private campaigns: Array<Campaign>;

  constructor() {
    this.campaigns = CAMPAIGNS;
  }

  getAll(): Array<Campaign> {
    return this.campaigns;
  }

  byId(id: string): Campaign {
    return this.campaigns.find(c => c.id === id);
  }

  add(name: string, content: object): void {
    const newCampaign: Campaign = {
      id: uuidv4(),
      name,
      content
    };
    this.campaigns.push(newCampaign);
  }

  save(campaign: Campaign): void {
    const index: number = this.campaigns.findIndex(c => c.id === campaign.id);
    if (index === -1) {
      this.add(campaign.name, campaign.content);
    } else {
      this.campaigns[index] = campaign;
    }
  }

  delete(id: string): void {
    this.campaigns = this.campaigns.filter(c => c.id !== id);
  }

  clear(): void {
    this.campaigns = [];
  }
}
