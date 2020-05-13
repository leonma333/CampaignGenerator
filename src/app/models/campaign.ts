interface ICampaign {
  id: string;
  name: string;
  content: object;
  schedule: object;
}

export class Campaign implements ICampaign {
  public id: string;
  public name: string;
  public content: object;
  public schedule: object

  constructor(id: string, name: string, content: object, schedule: object) {
    this.id = id;
    this.name = name;
    this.content = content;
    this.schedule = schedule;
  }
}
