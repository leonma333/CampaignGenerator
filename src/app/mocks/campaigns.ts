import { Campaign } from '../models/campaign';

export const campaigns: Array<Campaign> = [
  new Campaign('1', 'first campaign', { ops: [{ insert: 'Foo' }] }),
  new Campaign('2', 'second campaign', { ops: [{ insert: 'Bar' }] })
];
