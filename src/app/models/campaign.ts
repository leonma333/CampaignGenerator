interface ICampaign {
  id: string;
  name: string;
  content: object;
}

export class Campaign implements ICampaign {
  public id: string;
  public name: string;
  public content: object;

  constructor(id: string, name: string, content: object) {
    this.id = id;
    this.name = name;
    this.content = content;
  }
}
