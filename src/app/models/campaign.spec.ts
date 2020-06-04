import { Campaign } from '../models/campaign';

interface Content {
  ops: boolean;
}

type ScheduleStruct = {
  type: string;
};

describe('Model: Campaign', () => {
  let campaign: Campaign;

  beforeEach(() => {
    campaign = new Campaign('1', 'My campaign', null, null, null);
  });

  it('#default should thorw error', () => {
    expect(() => Campaign.default()).toThrowError();
  });

  describe('#value', () => {
    it('all objects', () => {
      campaign.content = {ops: true};
      campaign.schedule = {type: 'onetime'};
      campaign.demographic = {gender: 'male'};
      expect(campaign.value()).toEqual({
        name: 'My campaign',
        content: {ops: true},
        schedule: {type: 'onetime'},
        demographic: {gender: 'male'}
      });
    });

    it('with classes', () => {
      campaign.content = {ops: true} as Content;
      campaign.schedule = {type: 'onetime'} as ScheduleStruct;
      campaign.demographic = {gender: 'male'};
      expect(campaign.value()).toEqual({
        name: 'My campaign',
        content: {ops: true},
        schedule: {type: 'onetime'},
        demographic: {gender: 'male'}
      });
    });
  });

  describe('#from', () => {
    it('should change value', () => {
      campaign.from({
        id: '2',
        name: 'His campaign',
        content: {ops: false},
        schedule: {type: 'recurring'},
        demographic: {gender: 'male'}
      });
      expect(campaign.id).toBe('2');
      expect(campaign.name).toBe('His campaign');
      expect(campaign.content).toEqual({ops: false});
      expect(campaign.schedule).toEqual({type: 'recurring'});
      expect(campaign.demographic).toEqual({gender: 'male'});
    });
  });
});
