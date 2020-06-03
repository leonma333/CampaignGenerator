import { of } from 'rxjs';

const campaignObjs = [
  {
    name: 'first campaign',
    content: {ops: [{insert: 'Foo'}]},
    schedule: {
      dateStart: {year: 2020, month: 5, day: 25},
      time: {hour: 10, minute: 10, second: 0}
    },
    demographic: {gender: 'male'}
  }, {
    name: 'second campaign',
    content: {ops: [{insert: 'Bar'}]},
    schedule: {
      dateStart: {year: 2020, month: 6, day: 30},
      time: {hour: 20, minute: 20, second: 0}
    },
    demographic: {gender: 'female'}
  }, {
    name: 'Foo',
    content: {ops: [{insert: 'Bar'}]},
    schedule: {
      dateStart: {year: 2020, month: 6, day: 30},
      time: {hour: 12, minute: 30, second: 0}
    },
    demographic: {gender: 'female'}
  }
];

class Doc {
  public id: string;
  private name: string;
  private content: object;
  private schedule: object;
  private demographic: object;

  constructor(id: string, name: string, content: object, schedule: object, demographic: object) {
    this.id = id;
    this.name = name;
    this.content = content;
    this.schedule = schedule;
    this.demographic = demographic;
  }

  data() {
    return {
      id: this.id,
      name: this.name,
      content: this.content,
      schedule: this.schedule,
      demographic: this.demographic
    };
  }
}

const campaignDocs = [
  {
    payload: {
      doc: new Doc('1', 'first campaign', campaignObjs[0].content, campaignObjs[0].schedule, campaignObjs[0].demographic)
    }
  }, {
    payload: {
      doc: new Doc('2', 'second campaign', campaignObjs[1].content, campaignObjs[1].schedule, campaignObjs[1].demographic)
    }
  }, {
    payload: {
      doc: new Doc('3', 'Foo', campaignObjs[2].content, campaignObjs[2].schedule, campaignObjs[2].demographic)
    }
  }
];

let state = '';

const docValueStub = {
  set: jasmine.createSpy('set').and.returnValue(new Promise<string>(resolve => resolve('You just saved it'))),
  delete: jasmine.createSpy('delete').and.returnValue(new Promise<string>(resolve => resolve('You just deleted it'))),
  valueChanges: jasmine.createSpy('valueChanges').and.returnValue(of(campaignObjs[0]))
};

const collectionValueStub = {
  doc: jasmine.createSpy('doc').and.returnValue(docValueStub),
  add: jasmine.createSpy('add').and.returnValue(new Promise<string>(resolve => resolve('You just added it'))),
  valueChanges: jasmine.createSpy('valueChanges').and.returnValue(of(campaignObjs)),
  snapshotChanges: jasmine.createSpy('snapshotChanges').and.callFake(() => {
    if (state === 'search') {
      return of([campaignDocs[2]]);
    }
    if (state === 'sort') {
      return of(campaignDocs.slice(0, 2).reverse());
    }
    if (state === 'next') {
      return of([campaignDocs[1]]);
    }
    if (state === 'prev') {
      return of([campaignDocs[0]]);
    }
    return of(campaignDocs.slice(0, 2));
  })
};

export const FirestoreStub = {
  collection: jasmine.createSpy('collection').and.callFake((_, query?) => {
    if (query) {
      const ref = jasmine.createSpyObj('ref', ['orderBy', 'startAt', 'endAt', 'limit', 'startAfter', 'endBefore']);
      ref.startAfter.and.returnValue(ref);
      ref.endBefore.and.returnValue(ref);
      ref.orderBy.and.returnValue(ref);
      ref.startAt.and.returnValue(ref);
      ref.endAt.and.returnValue(ref);
      ref.limit.and.returnValue(ref);
      query(ref);

      if (ref.startAt.calls.mostRecent()) {
        if (ref.startAt.calls.mostRecent().args[0] === 'Foo') {
          expect(ref.limit.calls.mostRecent().args[0]).toBe(5);
          expect(ref.orderBy.calls.mostRecent().args[0]).toBe('name');
          expect(ref.endAt.calls.mostRecent().args[0]).toBe('Foo\uf8ff');
          state = 'search';
        } else if (ref.startAt.calls.mostRecent().args[0].id === '1') {
          expect(ref.limit.calls.mostRecent().args[0]).toBe(6);
          expect(ref.orderBy.calls.mostRecent().args[0]).toBe('timestamp');
          state = 'next';
        }
      } else if (ref.startAfter.calls.mostRecent()) {
        expect(ref.limit.calls.mostRecent().args[0]).toBe(6);
        expect(ref.orderBy.calls.mostRecent().args[0]).toBe('timestamp');
        expect(ref.startAfter.calls.mostRecent().args[0]).toEqual({id: '0'});
        expect(ref.endBefore.calls.mostRecent().args[0]).toEqual({id: '2'});
        state = 'prev';
      } else if (ref.orderBy.calls.mostRecent().args[0] === 'start') {
        state = 'sort';
      } else {
        state = '';
      }
    }

    return collectionValueStub;
  })
};
