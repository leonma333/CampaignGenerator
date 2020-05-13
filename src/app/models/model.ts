export abstract class Model {
  abstract value(): object;
  abstract from(value: any): void;

  static default(): object {
    throw new Error("not implemented!");
  }

  sanitize(obj: any): object {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch {
      return {};
    }
  }
}
