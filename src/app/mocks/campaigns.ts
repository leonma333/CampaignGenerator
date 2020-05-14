import { Campaign } from '../models/campaign';

export const campaigns: Array<Campaign> = [
  new Campaign('1', 'first campaign', {ops: [{ insert: 'Foo' }]}, {
  	type: 'onetime',
  	dateStart: {year: 2020, month: 6, day: 30},
  	time: {hour: 12, minute: 0, second: 0},
  	dateEnd: null,
  	repeat: null,
  	monthDay: null,
  	yearDay: null
  }),
  new Campaign('2', 'second campaign', {ops: [{ insert: 'Bar' }]}, {
  	type: 'recurring',
  	dateStart: {year: 2020, month: 6, day: 30},
  	time: {hour: 12, minute: 0, second: 0},
  	dateEnd: null,
  	repeat: 'day',
  	monthDay: null,
  	yearDay: null
  })
];
