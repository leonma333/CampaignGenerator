import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';

import { of } from 'rxjs';

import { Campaign } from '../models/campaign';
import { CampaignService } from './campaign.service';
import { FirestoreStub } from '../mocks/firestore';

describe('Service: CampaignService', () => {
  let service: CampaignService;
  let firestore: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CampaignService,
        { provide: AngularFirestore, useValue: FirestoreStub }
      ]
    });
    service = TestBed.inject(CampaignService);
    firestore = TestBed.inject(AngularFirestore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(firestore).toBeTruthy();
  });

  describe('#getAll', () => {
    it('should return 2 campaigns', (done) => {
      service.getAll().subscribe(result => {
        expect(result.length).toEqual(2);
        expect(result[0].id).toEqual('1');
        expect(result[0].name).toEqual('first campaign');
        expect(result[0].content).toEqual({ops: [{insert: 'Foo'}]});
        expect(result[1].id).toEqual('2');
        expect(result[1].name).toEqual('second campaign');
        expect(result[1].content).toEqual({ops: [{insert: 'Bar'}]});
        done();
      });
    });
  });

  describe('#byId', () => {
    it('should return campaign#1', (done) => {
      service.byId('1').subscribe(result => {
        expect(result.id).toEqual('1');
        expect(result.name).toEqual('first campaign');
        expect(result.content).toEqual({ops: [{insert: 'Foo'}]});
        done();
      });
    });
  });

  describe('#add', () => {
    it('should add new campaign#3', (done) => {
      const campaign = new Campaign('3', 'My campaign', {ops: [{insert: 'Hello world'}]});
      service.add(campaign.name, campaign.content).then(result => {
        expect(result).toBe('You just added it');
        expect(firestore.collection().add).toHaveBeenCalledTimes(1);
        expect(firestore.collection().add).toHaveBeenCalledWith({
          name: campaign.name,
          content: campaign.content
        });
        done();
      });
    });
  });

  describe('#save', () => {
    it('should override campaign#1', (done) => {
      const campaign = new Campaign('1', 'My campaign', {ops: [{insert: 'Hello world'}]});
      service.save(campaign).then(result => {
        expect(result).toBe('You just saved it');
        expect(firestore.collection().doc().set.calls.count()).toBe(1);
        expect(firestore.collection().doc).toHaveBeenCalledWith('1');
        expect(firestore.collection().doc().set).toHaveBeenCalledWith({
          name: campaign.name,
          content: campaign.content
        });
        done();
      });
    });
  });

  describe('#delete', () => {
    it('should delete campaign#1', (done) => {
      service.delete('1').then(result => {
        expect(result).toBe('You just deleted it');
        expect(firestore.collection().doc).toHaveBeenCalledWith('1');
        expect(firestore.collection().doc().delete.calls.count()).toBe(1);
        done();
      });
    });
  });
});
