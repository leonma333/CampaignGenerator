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
  }, {
    gender: 'netrual',
    minAge: 6,
    maxAge: 30,
    countries: ['US', 'CA', 'CN', 'TW']
  }),
  new Campaign('2', 'second campaign', {ops: [{ insert: 'Bar' }]}, {
    type: 'recurring',
    dateStart: {year: 2020, month: 6, day: 30},
    time: {hour: 12, minute: 0, second: 0},
    dateEnd: null,
    repeat: 'day',
    monthDay: null,
    yearDay: null
  }, {
    gender: 'male',
    minAge: 18,
    maxAge: 60,
    countries: ['BR', 'AR', 'CL']
  })
];
