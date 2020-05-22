import { of } from 'rxjs';

const campaignObjs = [
  {
    name: 'first campaign',
    content: {ops: [{insert: 'Foo'}]},
    schedule: {
      dateStart: {year: 2020, month: 5, day: 25},
      time: {hour: 10, minute: 10, second: 0}
    }
  }, {
    name: 'second campaign',
    content: {ops: [{insert: 'Bar'}]},
    schedule: {
      dateStart: {year: 2020, month: 6, day: 30},
      time: {hour: 20, minute: 20, second: 0}
    }
  }
];

class Doc {
  public id: string;
  private name: string;
  private content: object;
  private schedule: object;

  constructor(id: string, name: string, content: object, schedule: object) {
    this.id = id;
    this.name = name;
    this.content = content;
    this.schedule = schedule;
  }

  data() {
    return {
      id: this.id,
      name: this.name,
      content: this.content,
      schedule: this.schedule
    };
  }
}

const campaignDocs = [
  {
    payload: {
      doc: new Doc('1', 'first campaign', campaignObjs[0].content, campaignObjs[0].schedule)
    }
  }, {
    payload: {
      doc: new Doc('2', 'second campaign', campaignObjs[1].content, campaignObjs[1].schedule)
    }
  }
];

const docValueStub = {
  set: jasmine.createSpy('set').and.returnValue(new Promise<string>(resolve => resolve('You just saved it'))),
  delete: jasmine.createSpy('delete').and.returnValue(new Promise<string>(resolve => resolve('You just deleted it'))),
  valueChanges: jasmine.createSpy('valueChanges').and.returnValue(of(campaignObjs[0]))
};

const collectionValueStub = {
  doc: jasmine.createSpy('doc').and.returnValue(docValueStub),
  add: jasmine.createSpy('add').and.returnValue(new Promise<string>(resolve => resolve('You just added it'))),
  valueChanges: jasmine.createSpy('valueChanges').and.returnValue(of(campaignObjs)),
  snapshotChanges: jasmine.createSpy('snapshotChanges').and.returnValue(of(campaignDocs))
};

export const FirestoreStub = {
  collection: jasmine.createSpy('collection').and.returnValue(collectionValueStub)
};
