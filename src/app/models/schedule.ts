import { NgbDate, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

import * as moment from 'moment';

const nthToStringMap = {
  1: 'first',
  2: 'second',
  3: 'third',
  4: 'fourth',
  5: 'fifth'
};

enum Type {
  onetime = 'onetime',
  recurring = 'recurring'
};

enum Repeat {
  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year'
};

export type LongRepeat = {
  date: NgbDate,
  number: number;
  day: number;
};

export class Schedule {
  public type: Type;
  public dateStart: NgbDate;
  public dateEnd: NgbDate;
  public time: NgbTimeStruct;
  public repeat: Repeat;
  public weekDays: Array<number>;
  public monthDay: LongRepeat;
  public yearDay: LongRepeat;

  constructor(type: string, dateStart: NgbDate, dateEnd: NgbDate, time: NgbTimeStruct, repeat: string,
    weekDays: Array<number>, monthDay: LongRepeat, yearDay: LongRepeat) {
    this.type = Type[type];
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.time = time;
    this.repeat = Repeat[repeat];
    this.weekDays = weekDays;
    this.monthDay = monthDay;
    this.yearDay = yearDay;
  }

  value(): object {
    return {yes: true};
  }

  from(value: object): void {
    console.log('Calling');
  }

  static getWeekDayName(day: number): string {
    return moment().day(day).format('dddd');
  }

  static getWeekDayNameFromDate(date: string): string {
    return moment(date).format('dddd');
  }

  static getMonthNameFromDate(date: string): string {
    return moment(date).format('MMMM');
  }

  static getMonthDateNameFromDate(date: string): string {
    return moment(date).format('MMMM D');
  }

  static getWeekOfMonth(date: string): string {
    const firstDate = moment(date);
    const nthOfMoth = Math.ceil(firstDate.date() / 7);

    return nthToStringMap[nthOfMoth];
  }
}