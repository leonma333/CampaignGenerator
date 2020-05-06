import { TestBed } from '@angular/core/testing';

import { Campaign } from '../models/campaign';
import { CampaignService } from './campaign.service';

describe('Service: CampaignService', () => {
  let service: CampaignService;
  const campaigns: Array<Campaign> = [
    {
      id: '1',
      name: 'first campaign',
      content: { ops: [{ insert: 'Hello world' }] }
    },
    {
      id: '2',
      name: 'second campaign',
      content: { ops: [{ insert: 'Hey' }] }
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CampaignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getAll', () => {
    beforeEach(() => {
      service.clear();
      service.add(campaigns[0].name, campaigns[0].content);
    });

    it('should return 1 campaign', () => {
      const result: Array<Campaign> = service.getAll();
      expect(result.length).toEqual(1);
      expect(result[0].name).toEqual(campaigns[0].name);
      expect(result[0].content).toEqual(campaigns[0].content);
      expect(result[0].id.length).toEqual(36);
    });

    it('should return 2 campaigns', () => {
      service.add(campaigns[1].name, campaigns[1].content);

      const result: Array<Campaign> = service.getAll();
      expect(result.length).toEqual(2);
      expect(result[1].name).toEqual(campaigns[1].name);
      expect(result[1].content).toEqual(campaigns[1].content);
      expect(result[1].id.length).toEqual(36);
    });

    it('should return 0 campaigns', () => {
      service.clear();

      const result: Array<Campaign> = service.getAll();
      expect(result.length).toEqual(0);
    });
  });

  describe('#byId', () => {
    let ids: Array<string>;

    beforeEach(() => {
      service.clear();
      service.add(campaigns[0].name, campaigns[0].content);
      service.add(campaigns[1].name, campaigns[1].content);
      ids = service.getAll().map(campaign => campaign.id);
    });

    it('should return campaign#1', () => {
      const result: Campaign = service.byId(ids[0]);
      expect(result.name).toEqual(campaigns[0].name);
      expect(result.content).toEqual(campaigns[0].content);
    });

    it('should return campaign#2', () => {
      const result: Campaign = service.byId(ids[1]);
      expect(result.name).toEqual(campaigns[1].name);
      expect(result.content).toEqual(campaigns[1].content);
    });

    it('should return undefined if not found', () => {
      const result: Campaign = service.byId('3');
      expect(result).toBeUndefined();
    });
  });

  describe('#save', () => {
    let id: string;

    beforeEach(() => {
      service.clear();
      service.add(campaigns[0].name, campaigns[0].content);
      id = service.getAll()[0].id;
    });

    it('should override campaign#1', () => {
      const campaign: Campaign = {
        id,
        name: 'My campaign',
        content: {ops: [{insert: 'Foo'}]}
      };
      service.save(campaign);
      const result: Array<Campaign> = service.getAll();
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual(campaign);
    });

    it('should add campaign if not found', () => {
      const campaign: Campaign = {
        id: '2',
        name: 'My campaign',
        content: {ops: [{insert: 'Foo'}]}
      };
      service.save(campaign);
      const result: Array<Campaign> = service.getAll();
      expect(result.length).toEqual(2);
      expect(result[1].name).toEqual(campaign.name);
      expect(result[1].content).toEqual(campaign.content);
    });
  });

  describe('#delete', () => {
    let id: string;

    beforeEach(() => {
      service.clear();
      service.add(campaigns[0].name, campaigns[0].content);
      id = service.getAll()[0].id;
    });

    it('should delete campaign#1', () => {
      service.delete(id);
      const result: Array<Campaign> = service.getAll();
      expect(result.length).toEqual(0);
    });

    it('should do nothing if not found', () => {
      service.delete('2');
      const result: Array<Campaign> = service.getAll();
      expect(result.length).toEqual(1);
    });
  });
});
