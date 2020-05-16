export abstract class Model {
  static default(): object {
    throw new Error('not implemented!');
  }

  static sanitize(obj: any): object {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch {
      return {};
    }
  }

  abstract value(): object;
  abstract from(value: any): void;
}
