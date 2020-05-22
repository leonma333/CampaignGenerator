import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';

import * as moment from 'moment';

import { Campaign } from '../models/campaign';
import { CampaignService } from './campaign.service';
import { FirestoreStub } from '../mocks/firestore';

fdescribe('Service: CampaignService', () => {
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
      service.getAll('timestamp').subscribe(result => {
        expect(result.length).toEqual(2);
        expect(result[0].id).toEqual('1');
        expect(result[0].name).toEqual('first campaign');
        expect(result[0].content).toEqual({ops: [{insert: 'Foo'}]});
        expect(result[0].schedule).toEqual({
          dateStart: {year: 2020, month: 5, day: 25},
          time: {hour: 10, minute: 10, second: 0}
        });
        expect(result[1].id).toEqual('2');
        expect(result[1].name).toEqual('second campaign');
        expect(result[1].content).toEqual({ops: [{insert: 'Bar'}]});
        expect(result[1].schedule).toEqual({
          dateStart: {year: 2020, month: 6, day: 30},
          time: {hour: 20, minute: 20, second: 0}
        });
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
        expect(result.schedule).toEqual({
          dateStart: {year: 2020, month: 5, day: 25},
          time: {hour: 10, minute: 10, second: 0}
        });
        done();
      });
    });
  });

  describe('#add', () => {
    it('should add new campaign#3', (done) => {
      const today = moment.utc('2020-05-20').toDate();
      jasmine.clock().mockDate(today);

      const campaign = new Campaign('3', 'My campaign', {ops: [{insert: 'Hello world'}]}, {
          dateStart: {year: 2020, month: 5, day: 25},
          time: {hour: 10, minute: 10, second: 0}
        });
      service.add(campaign.name, campaign.content, campaign.schedule).then(result => {
        expect(result).toBe('You just added it');
        expect(firestore.collection().add).toHaveBeenCalledTimes(1);
        const args = firestore.collection().add.calls.argsFor(0)[0];
        expect(args.name).toBe(campaign.name);
        expect(args.content).toEqual(campaign.content);
        expect(args.schedule).toEqual(campaign.schedule);
        expect(args.start).toBe(1590401400);
        expect(args.timestamp.Rc).toBe('FieldValue.serverTimestamp');
        done();
      });
    });
  });

  describe('#save', () => {
    it('should override campaign#1', (done) => {
      const today = moment.utc('2020-05-20').toDate();
      jasmine.clock().mockDate(today);

      const campaign = new Campaign('1', 'My campaign', {ops: [{insert: 'Hello world'}]}, {
          dateStart: {year: 2020, month: 5, day: 25},
          time: {hour: 10, minute: 10, second: 0}
        });
      service.save(campaign).then(result => {
        expect(result).toBe('You just saved it');
        expect(firestore.collection().doc().set.calls.count()).toBe(1);
        expect(firestore.collection().doc).toHaveBeenCalledWith('1');
        const args = firestore.collection().doc().set.calls.argsFor(0)[0];
        expect(args.name).toBe(campaign.name);
        expect(args.content).toEqual(campaign.content);
        expect(args.schedule).toEqual(campaign.schedule);
        expect(args.start).toBe(1590401400);
        expect(args.timestamp.Rc).toBe('FieldValue.serverTimestamp');
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
