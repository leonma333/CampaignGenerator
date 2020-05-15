import * as moment from 'moment';
import { NgbDate, NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

import { Schedule, LongRepeat } from '../models/schedule';

describe('Model: Schedule', () => {
  const date = new NgbDate(2020, 6, 30);
  const dateStruct: NgbDateStruct = {year: 2020, month: 6, day: 30};
  const time: NgbTimeStruct = {hour: 12, minute: 0, second: 0};
  const dateEnd: NgbDate = new NgbDate(2020, 7, 10);
  const dateEndStruct: NgbDateStruct = {year: 2020, month: 7, day: 10};
  const month: LongRepeat = {day: 30, number: null, month: null};
  const year: LongRepeat = {day: 30, number: null, month: 6};

  beforeEach(() => {
    const today = moment('2020-06-30').toDate();
    jasmine.clock().mockDate(today);
  });

  it('#default', () => {
    expect(Schedule.default()).toEqual({
      type: 'onetime',
      dateStart: dateStruct,
      dateEnd: null,
      time,
      repeat: null,
      weekDays: null,
      monthDay: null,
      yearDay: null
    });
  });

  it('#pad', () => {
    expect(Schedule.pad(1)).toBe('01');
    expect(Schedule.pad(10)).toBe('10');
    expect(Schedule.pad(100)).toBe('100');
  });

  it('#padTime', () => {
    expect(Schedule.padTime({hour: 3, minute: 0, second: 0})).toBe('03:00');
    expect(Schedule.padTime({hour: 0, minute: 0, second: 0})).toBe('00:00');
    expect(Schedule.padTime({hour: 15, minute: 30, second: 15})).toBe('15:30');
  });

  it('#getWeekDayName', () => {
    expect(Schedule.getWeekDayName(0)).toBe('Sunday');
    expect(Schedule.getWeekDayName(1)).toBe('Monday');
    expect(Schedule.getWeekDayName(6)).toBe('Saturday');
  });

  it('#getWeekDayNameFromDate', () => {
    expect(Schedule.getWeekDayNameFromDate('2020-06-30')).toBe('Tuesday');
    expect(Schedule.getWeekDayNameFromDate(moment('2020-06-30'))).toBe('Tuesday');
  });

  it('#getMonthNameFromDate', () => {
    expect(Schedule.getMonthNameFromDate('2020-06-30')).toBe('June');
    expect(Schedule.getMonthNameFromDate(moment('2020-06-30'))).toBe('June');
  });

  it('#getMonthDateNameFromDate', () => {
    expect(Schedule.getMonthDateNameFromDate('2020-06-30')).toBe('June 30');
    expect(Schedule.getMonthDateNameFromDate(moment('2020-06-30'))).toBe('June 30');
  });

  it('#getWeekOfMonth', () => {
    expect(Schedule.getWeekOfMonth('2020-06-30')).toBe(5);
    expect(Schedule.getWeekOfMonth('2020-06-10')).toBe(2);
  });

  it('#getWeekOfMonthNameFromDate', () => {
    expect(Schedule.getWeekOfMonthNameFromDate('2020-06-30')).toBe('fifth');
    expect(Schedule.getWeekOfMonthNameFromDate('2020-06-10')).toBe('second');
  });

  describe('#value', () => {
    it('onetime', () => {
      const schedule = new Schedule('onetime', date, dateEnd, time, 'week', [1, 3], month, year);
      expect(schedule.value()).toEqual({
        type: 'onetime',
        dateStart: dateStruct,
        dateEnd: null,
        time: {hour: 12, minute: 0, second: 0},
        repeat: null,
        weekDays: null,
        monthDay: null,
        yearDay: null
      });
    });

    it('recurring day', () => {
      const schedule = new Schedule('recurring', date, dateEnd, time, 'day', [1, 3], month, year);
      expect(schedule.value()).toEqual({
        type: 'recurring',
        dateStart: dateStruct,
        dateEnd: dateEndStruct,
        time,
        repeat: 'day',
        weekDays: null,
        monthDay: null,
        yearDay: null
      });
    });

    it('recurring week', () => {
      const schedule = new Schedule('recurring', date, dateEnd, time, 'week', [1, 3], month, year);
      expect(schedule.value()).toEqual({
        type: 'recurring',
        dateStart: dateStruct,
        dateEnd: dateEndStruct,
        time,
        repeat: 'week',
        weekDays: [1, 3],
        monthDay: null,
        yearDay: null
      });
    });

    it('recurring month', () => {
      const schedule = new Schedule('recurring', date, dateEnd, time, 'month', [1, 3], month, year);
      expect(schedule.value()).toEqual({
        type: 'recurring',
        dateStart: dateStruct,
        dateEnd: dateEndStruct,
        time,
        repeat: 'month',
        weekDays: null,
        monthDay: month,
        yearDay: null
      });
    });

    it('recurring year', () => {
      const schedule = new Schedule('recurring', date, dateEnd, time, 'year', [1, 3], month, year);
      expect(schedule.value()).toEqual({
        type: 'recurring',
        dateStart: dateStruct,
        dateEnd: dateEndStruct,
        time,
        repeat: 'year',
        weekDays: null,
        monthDay: null,
        yearDay: year
      });
    });
  });

  describe('#from', () => {
    let schedule: Schedule;

    beforeEach(() => {
      schedule = new Schedule(null, null, null, null, null, null, null, null);
    });

    it('valid fields', () => {
      schedule.from({
        type: 'onetime',
        dateStart: date,
        dateEnd,
        time,
        repeat: 'week',
        weekDays: [1, 3],
        monthDay: month,
        yearDay: year
      });
      expect(schedule.type).toBe('onetime');
      expect(schedule.dateStart).toEqual(date);
      expect(schedule.dateEnd).toEqual(dateEnd);
      expect(schedule.time).toEqual(time);
      expect(schedule.repeat).toBe('week');
      expect(schedule.weekDays).toEqual([1, 3]);
      expect(schedule.monthDay).toEqual(month);
      expect(schedule.yearDay).toEqual(year);
    });

    it('invalid fields', () => {
      schedule.from({
        type: 'invalid',
        dateStart: null,
        dateEnd: null,
        time: null,
        repeat: 'invalid',
        weekDays: null,
        monthDay: null,
        yearDay: null
      });
      expect(schedule.type).toBeUndefined();
      expect(schedule.dateStart).toBeNull();
      expect(schedule.dateEnd).toBeNull();
      expect(schedule.time).toBeNull();
      expect(schedule.repeat).toBeUndefined();
      expect(schedule.weekDays).toBeNull();
      expect(schedule.monthDay).toBeNull();
      expect(schedule.yearDay).toBeNull();
    });
  });

  it('#setType', () => {
    const schedule = new Schedule(null, null, null, null, null, null, null, null);
    schedule.setType('onetime');
    expect(schedule.type).toBe('onetime');
    schedule.setType('recurring');
    expect(schedule.type).toBe('recurring');
    schedule.setType('invalid');
    expect(schedule.type).toBeUndefined();
  });

  it('#setRepeat', () => {
    const schedule = new Schedule(null, null, null, null, null, null, null, null);
    schedule.setRepeat('week');
    expect(schedule.repeat).toBe('week');
    schedule.setRepeat('day');
    expect(schedule.repeat).toBe('day');
    schedule.setRepeat('month');
    expect(schedule.repeat).toBe('month');
    schedule.setRepeat('year');
    expect(schedule.repeat).toBe('year');
    schedule.setRepeat('invalid');
    expect(schedule.repeat).toBeUndefined();
  });

  describe('#format', () => {
    let schedule: Schedule;

    beforeEach(() => {
      schedule = new Schedule(null, null, null, null, null, null, null, null);
    });

    it('onetime', () => {
      schedule.from({
        type: 'onetime',
        dateStart: date,
        dateEnd: null,
        time,
        repeat: null,
        weekDays: null,
        monthDay: null,
        yearDay: null
      });
      expect(schedule.format()).toBe('Scheduled on 2020-06-30 @ 12:00');
    });

    it('recurring week', () => {
      schedule.from({
        type: 'recurring',
        dateStart: date,
        dateEnd: null,
        time,
        repeat: 'week',
        weekDays: [1, 3],
        monthDay: null,
        yearDay: null
      });
      expect(schedule.format()).toBe('Scheduled every Monday, Wednesday from 2020-06-30 @ 12:00');
    });

    it('recurring day', () => {
      schedule.from({
        type: 'recurring',
        dateStart: date,
        dateEnd: null,
        time,
        repeat: 'day',
        weekDays: null,
        monthDay: null,
        yearDay: null
      });
      expect(schedule.format()).toBe('Scheduled every day from 2020-06-30 @ 12:00');
    });

    it('recurring month', () => {
      schedule.from({
        type: 'recurring',
        dateStart: date,
        dateEnd: null,
        time,
        repeat: 'month',
        weekDays: null,
        monthDay: month,
        yearDay: null
      });
      expect(schedule.format()).toBe('Scheduled every 30 from 2020-06-30 @ 12:00');
      schedule.monthDay = {number: 5, day: 2, month: null};
      expect(schedule.format()).toBe('Scheduled every fifth Tuesday from 2020-06-30 @ 12:00');
    });

    it('recurring year', () => {
      schedule.from({
        type: 'recurring',
        dateStart: date,
        dateEnd: null,
        time,
        repeat: 'year',
        weekDays: null,
        monthDay: null,
        yearDay: year
      });
      expect(schedule.format()).toBe('Scheduled every June 30 from 2020-06-30 @ 12:00');
      schedule.yearDay = {number: 5, day: 2, month: 6};
      expect(schedule.format()).toBe('Scheduled every fifth Tuesday of June from 2020-06-30 @ 12:00');
    });

    it('recurring range', () => {
      schedule.from({
        type: 'recurring',
        dateStart: date,
        dateEnd,
        time,
        repeat: 'week',
        weekDays: [1, 3],
        monthDay: null,
        yearDay: null
      });
      expect(schedule.format()).toBe('Scheduled every Monday, Wednesday from 2020-06-30 to 2020-07-10 @ 12:00');
    });
  });
});
