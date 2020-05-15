import { Model } from './model';

export class Campaign extends Model {
  public id: string;
  public name: string;
  public content: object;
  public schedule: object;

  constructor(id: string, name: string, content: object, schedule: object) {
    super();
    this.id = id;
    this.name = name;
    this.content = content;
    this.schedule = schedule;
  }

  value(): object {
    return {
      name: this.name,
      content: Campaign.sanitize(this.content),
      schedule: Campaign.sanitize(this.schedule)
    };
  }

  from(value: any): void {
    this.id = value.id;
    this.name = value.name;
    this.content = value.content;
    this.schedule = value.schedule;
  }
}
