import { of } from 'rxjs';

const campaignObjs = [
  {
    name: 'first campaign',
    content: {ops: [{insert: 'Foo'}]}
  }, {
    name: 'second campaign',
    content: {ops: [{insert: 'Bar'}]}
  }
];

class Doc {
  public id: string;
  private name: string;
  private content: object;

  constructor(id: string, name: string, content: object) {
    this.id = id;
    this.name = name;
    this.content = content;
  }

  data() {
    return {
      id: this.id,
      name: this.name,
      content: this.content
    };
  }
}

const campaignDocs = [
  {
    payload: {
      doc: new Doc('1', 'first campaign', {ops: [{insert: 'Foo'}]})
    }
  }, {
    payload: {
      doc: new Doc('2', 'second campaign', {ops: [{insert: 'Bar'}]})
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
