import { NgbDate, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

import * as moment from 'moment';

import { Model } from './model';

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
}

enum Repeat {
  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year'
}

export type LongRepeat = {
  month: number;
  number: number;
  day: number;
};

export class Schedule extends Model {
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
    super();
    this.type = Type[type];
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.time = time;
    this.repeat = Repeat[repeat];
    this.weekDays = weekDays;
    this.monthDay = monthDay;
    this.yearDay = yearDay;
  }

  static default(): object {
    const now = moment();
    const schedule = new Schedule(null, null, null, null, null, null, null, null);
    schedule.type = Type.onetime;
    schedule.dateStart = new NgbDate(now.year(), now.month() + 1, now.date());
    schedule.time = {hour: 12, minute: 0, second: 0};
    return schedule.value();
  }

  static pad = (i: number): string => i < 10 ? `0${i}` : `${i}`;

  static padTime(time: NgbTimeStruct): string {
    return Schedule.pad(time.hour) + ':' + Schedule.pad(time.minute);
  }

  static getWeekDayName(day: number): string {
    return moment().day(day).format('dddd');
  }

  static getWeekDayNameFromDate(date: any): string {
    return moment(date).format('dddd');
  }

  static getMonthNameFromDate(date: any): string {
    return moment(date).format('MMMM');
  }

  static getMonthDateNameFromDate(date: any): string {
    return moment(date).format('MMMM D');
  }

  static getWeekOfMonth(date: string): number {
    const firstDate = moment(date);
    return Math.ceil(firstDate.date() / 7);
  }

  static getWeekOfMonthNameFromDate(date: any): string {
    return nthToStringMap[Schedule.getWeekOfMonth(date)];
  }

  value(): object {
    const isRepeat = this.type === Type.recurring;
    return {
      type: this.type,
      dateStart: Schedule.sanitize(this.dateStart),
      dateEnd: this.type === Type.recurring ? Schedule.sanitize(this.dateEnd) : null,
      time: Schedule.sanitize(this.time),
      repeat: isRepeat ? this.repeat : null,
      weekDays: isRepeat && this.repeat === Repeat.week ? this.weekDays : null,
      monthDay: isRepeat && this.repeat === Repeat.month ? Schedule.sanitize(this.monthDay) : null,
      yearDay: isRepeat && this.repeat === Repeat.year ? Schedule.sanitize(this.yearDay) : null
    };
  }

  from(value: any): void {
    this.type = Type[value.type];
    this.dateStart = value.dateStart;
    this.dateEnd = value.dateEnd;
    this.time = value.time;
    this.repeat = Repeat[value.repeat];
    this.weekDays = value.weekDays;
    this.monthDay = value.monthDay;
    this.yearDay = value.yearDay;
  }

  setType(type: string) {
    this.type = Type[type];
  }

  setRepeat(repeat: string) {
    this.repeat = Repeat[repeat];
  }

  format(): string {
    let result = '';
    const date = moment().year(this.dateStart.year).month(this.dateStart.month - 1).date(this.dateStart.day);
    if (this.repeat === Repeat.day) {
      result = 'day';
    } else if (this.repeat === Repeat.week) {
      for (let i = 1; i <= 7; i++) {
        if (this.weekDays.includes(i)) {
          result += Schedule.getWeekDayName(i) + ', ';
        }
      }
      result = result.slice(0, -2);
    } else if (this.repeat === Repeat.month) {
      if (this.monthDay.number === null) {
        result = this.dateStart.day.toString();
      } else {
        result = Schedule.getWeekOfMonthNameFromDate(date) + ' ' + Schedule.getWeekDayNameFromDate(date);
      }
    } else if (this.repeat === Repeat.year) {
      if (this.yearDay.number) {
        result = Schedule.getWeekOfMonthNameFromDate(date) + ' ' + Schedule.getWeekDayNameFromDate(date) + ' of '
          + Schedule.getMonthNameFromDate(date);
      } else {
        result = Schedule.getMonthDateNameFromDate(date);
      }
    } else {
      return 'Scheduled on ' + date.format('YYYY-MM-DD') + ' @ ' + Schedule.padTime(this.time);
    }
    let range = date.format('YYYY-MM-DD');
    if (this.dateEnd) {
      const later = moment().year(this.dateEnd.year).month(this.dateEnd.month - 1).date(this.dateEnd.day);
      range += ' to ' + later.format('YYYY-MM-DD');
    }
    return 'Scheduled every ' + result + ' from ' + range + ' @ ' + Schedule.padTime(this.time);
  }
}
