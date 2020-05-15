import { Model } from '../models/model';

class Dummy extends Model {
  from(value: any): void { }
  value(): object {
    return {};
  }
}

type MyType = {
  foo: string;
};

describe('Model: Model', () => {
  const model: Model = new Dummy();

  it('#default should thorw error', () => {
    expect(() => Model.default()).toThrowError();
  });

  describe('#sanitize', () => {
    it('should convert anything to object', () => {
      const data = {
        nonClass: {foo: 'bar'},
        class: {foo: 'bar'} as MyType
      };
      expect(model.sanitize(data)).toEqual({
        nonClass: {foo: 'bar'},
        class: {foo: 'bar'}
      });
    });

    it('should handle non-valid input', () => {
      const data = undefined;
      expect(model.sanitize(data)).toEqual({});
    });
  });
});
