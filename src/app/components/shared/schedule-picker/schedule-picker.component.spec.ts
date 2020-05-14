import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormControl, FormBuilder } from '@angular/forms';
import { Component, ViewChild, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import * as moment from 'moment';
import { NgbModule, NgbDate, NgbCalendar, NgbDateStruct,
  NgbDateParserFormatter, NgbCalendarGregorian } from '@ng-bootstrap/ng-bootstrap';

import { SchedulePickerComponent } from './schedule-picker.component';

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

class NgbDateISOParserFormatter extends NgbDateParserFormatter {
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

// End copy

@Component({
  template: '<app-schedule-picker [formControl]="scheduleData"></app-schedule-picker>'
})
class TestOnetimeSchedulePickerComponent {
  @ViewChild(SchedulePickerComponent)
  schedulePickerComponent: SchedulePickerComponent;
  scheduleData: FormControl = new FormControl({
    type: 'onetime',
    dateStart: {year: 2020, month: 6, day: 15},
    dateEnd: null,
    time: {hour: 5, minute: 30, second: 0},
    repeat: null,
    weekDays: null,
    monthDay: null,
    yearDay: null
  });
}

describe('Component: SchedulePickerComponent', () => {
  function expectOutputFormat(output: string, isOnetime: boolean, fixture: ComponentFixture<any>) {
    const outputEl: DebugElement = fixture.debugElement.query(By.css(isOnetime ? '.onetime-format' : '.repeat-format'));
    expect(outputEl.nativeElement.innerText).toBe(output);
  }

  beforeEach(() => {
    const today = moment('2020-06-10').toDate();
    jasmine.clock().mockDate(today);
  });

  describe('no input', () => {
    let component: SchedulePickerComponent;
    let fixture: ComponentFixture<SchedulePickerComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, FormsModule, NgbModule ],
        providers: [
          FormBuilder, {
            privide: NgbDateParserFormatter,
            useClass: NgbDateISOParserFormatter
          }, {
            provider: NgbCalendar,
            useClass: NgbCalendarGregorian
          }
        ],
        declarations: [ SchedulePickerComponent ]
      })
      .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(SchedulePickerComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
      expect(component.mainForm.controls.selectedDate.value).toEqual(new NgbDate(2020, 6, 10));
      expect(component.mainForm.controls.selectedTime.value).toEqual({hour: 12, minute: 0, second: 0});
      expectOutputFormat('It will be scheduled on 2020-06-10 @ 12:00', true, fixture);
    });

    it('change date', () => {
      const dateEl: DebugElement = fixture.debugElement.query(By.css('[aria-label="Tuesday, June 30, 2020"]'));
      dateEl.nativeElement.click();
      fixture.detectChanges();
      expect(component.mainForm.controls.selectedDate.value).toEqual({year: 2020, month: 6, day: 30});

      const timeEl: DebugElement = fixture.debugElement.query(By.css('.ngb-tp-hour button'));
      timeEl.nativeElement.click();
      fixture.detectChanges();
      expect(component.mainForm.controls.selectedTime.value).toEqual({hour: 13, minute: 0, second: 0});
      expectOutputFormat('It will be scheduled on 2020-06-30 @ 13:00', true, fixture);
    });

    it('change to recurring', () => {
      const recurringEl: DebugElement = fixture.debugElement.query(By.css('#recurring'));
      recurringEl.nativeElement.click();

      fixture.detectChanges();

      expect(component.mainForm.controls.toDate.value).toEqual(new NgbDate(2020, 6, 20));
      expect(component.mainForm.controls.selectedRepeatPeriod.value).toEqual('week');
      expect(component.mainForm.controls.weekGroupForm.value).toEqual({
        1: false, 2: false, 3: true, 4: false, 5: false, 6: false, 7: false
      });
      expectOutputFormat('Occurs every Wednesday from 2020-06-10 to 2020-06-20 @ 12:00', false, fixture);
    });
  });

  describe('with onetime input', () => {
    let component: TestOnetimeSchedulePickerComponent;
    let fixture: ComponentFixture<TestOnetimeSchedulePickerComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, FormsModule, NgbModule ],
        providers: [
          FormBuilder, {
            privide: NgbDateParserFormatter,
            useClass: NgbDateISOParserFormatter
          }, {
            provider: NgbCalendar,
            useClass: NgbCalendarGregorian
          }
        ],
        declarations: [ TestOnetimeSchedulePickerComponent, SchedulePickerComponent ]
      })
      .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestOnetimeSchedulePickerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component.schedulePickerComponent).toBeTruthy();
    });
  });
});
