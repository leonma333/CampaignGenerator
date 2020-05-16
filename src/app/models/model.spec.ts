import { Model } from '../models/model';

type MyType = {
  foo: string;
};

describe('Model: Model', () => {
  it('#default should thorw error', () => {
    expect(() => Model.default()).toThrowError();
  });

  describe('#sanitize', () => {
    it('should convert anything to object', () => {
      const data = {
        nonClass: {foo: 'bar'},
        class: {foo: 'bar'} as MyType
      };
      expect(Model.sanitize(data)).toEqual({
        nonClass: {foo: 'bar'},
        class: {foo: 'bar'}
      });
    });

    it('should handle non-valid input', () => {
      const data = undefined;
      expect(Model.sanitize(data)).toEqual({});
    });
  });
});
