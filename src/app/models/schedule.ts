import * as moment from 'moment';

export class Schedule {

  static getDayName(day: number): string {
    return moment().day(day).format('dddd');
  }
}