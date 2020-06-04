import { Model } from './model';

export class Campaign extends Model {
  public id: string;
  public name: string;
  public content: object;
  public schedule: any;
  public demographic: any;

  public doc: any;

  constructor(id: string, name: string, content: object, schedule: object, demographic: object) {
    super();
    this.id = id;
    this.name = name;
    this.content = content;
    this.schedule = schedule;
    this.demographic = demographic;
  }

  value(): object {
    return {
      name: this.name,
      content: Campaign.sanitize(this.content),
      schedule: Campaign.sanitize(this.schedule),
      demographic: Campaign.sanitize(this.demographic)
    };
  }

  from(value: any): void {
    this.id = value.id;
    this.name = value.name;
    this.content = value.content;
    this.schedule = value.schedule;
    this.demographic = value.demographic;
  }
}
