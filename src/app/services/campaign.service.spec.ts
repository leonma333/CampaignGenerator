import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';

import * as moment from 'moment';

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
      service.getAll('timestamp').subscribe(result => {
        expect(result.length).toBe(2);
        expect(result[0].id).toBe('1');
        expect(result[0].doc.id).toBe('1');
        expect(result[0].name).toEqual('first campaign');
        expect(result[0].content).toEqual({ops: [{insert: 'Foo'}]});
        expect(result[0].schedule).toEqual({
          dateStart: {year: 2020, month: 5, day: 25},
          time: {hour: 10, minute: 10, second: 0}
        });
        expect(result[1].id).toBe('2');
        expect(result[1].doc.id).toBe('2');
        expect(result[1].name).toEqual('second campaign');
        expect(result[1].content).toEqual({ops: [{insert: 'Bar'}]});
        expect(result[1].schedule).toEqual({
          dateStart: {year: 2020, month: 6, day: 30},
          time: {hour: 20, minute: 20, second: 0}
        });
        done();
      });
    });

    it('should sort result', (done) => {
      service.getAll('start').subscribe(result => {
        expect(result.length).toBe(2);
        expect(result[0].id).toBe('2');
        expect(result[0].doc.id).toBe('2');
        expect(result[0].name).toEqual('second campaign');
        expect(result[0].content).toEqual({ops: [{insert: 'Bar'}]});
        expect(result[0].schedule).toEqual({
          dateStart: {year: 2020, month: 6, day: 30},
          time: {hour: 20, minute: 20, second: 0}
        });
        expect(result[1].id).toBe('1');
        expect(result[1].doc.id).toBe('1');
        expect(result[1].name).toEqual('first campaign');
        expect(result[1].content).toEqual({ops: [{insert: 'Foo'}]});
        expect(result[1].schedule).toEqual({
          dateStart: {year: 2020, month: 5, day: 25},
          time: {hour: 10, minute: 10, second: 0}
        });
        done();
      });
    });

    it('should paginate next', (done) => {
      service.getAll('timestamp', {startAt: {id: '1'}}).subscribe(result => {
        expect(result.length).toBe(1);
        expect(result[0].id).toBe('2');
        expect(result[0].doc.id).toBe('2');
        done();
      });
    });

    it('should paginate previous', (done) => {
      service.getAll('timestamp', {startAfter: {id: '0'}, endBefore: {id: '2'}}).subscribe(result => {
        expect(result.length).toBe(1);
        expect(result[0].id).toBe('1');
        expect(result[0].doc.id).toBe('1');
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
        expect(args.timestamp).toBeDefined();
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
        expect(args.timestamp).toBeDefined();
        done();
      });
    });
  });

  describe('#search', () => {
    it('should return search result', (done) => {
      service.search('Foo').subscribe(campaigns => {
        expect(campaigns.length).toBe(1);
        expect(campaigns[0].name).toBe('Foo');
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
