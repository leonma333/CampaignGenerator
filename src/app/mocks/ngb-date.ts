import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

// Copy from ng-bootstrap source code

function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}

function isNumber(value: any): value is number {
  return !isNaN(toInteger(value));
}

function padNumber(value: number) {
  if (isNumber(value)) {
    return `0${value}`.slice(-2);
  } else {
    return '';
  }
}

export class NgbDateISOParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct | null {
    if (value != null) {
      const dateParts = value.trim().split('-');
      if (dateParts.length === 1 && isNumber(dateParts[0])) {
        return {year: toInteger(dateParts[0]), month: null as any, day: null as any};
      } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
        return {year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: null as any};
      } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
        return {year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: toInteger(dateParts[2])};
      }
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ?
        `${date.year}-${isNumber(date.month) ? padNumber(date.month) : ''}-${isNumber(date.day) ? padNumber(date.day) : ''}` :
        '';
  }
}
