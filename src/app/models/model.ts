export abstract class Model {
  static default(): object {
    throw new Error('not implemented!');
  }

  abstract value(): object;
  abstract from(value: any): void;

  sanitize(obj: any): object {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch {
      return {};
    }
  }
}
