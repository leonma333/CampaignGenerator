import { Component, OnInit, forwardRef } from '@angular/core';
import { FormBuilder, FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

import { NgbCalendar, NgbDate, NgbTimeStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { Schedule, LongRepeat } from '../../../models/schedule';

@Component({
  selector: 'app-schedule-picker',
  templateUrl: './schedule-picker.component.html',
  styleUrls: ['./schedule-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SchedulePickerComponent),
      multi: true,
    }
  ]
})
export class SchedulePickerComponent implements OnInit, ControlValueAccessor {
  scheduleData: Schedule;

  minDate: NgbDate;
  hoveredDate: NgbDate | null = null;

  repeatPeriods = {
    day: 'Every day',
    week: 'Every week',
    month: 'Every month',
    year: 'Every year'
  };
  repeatFormat: string;

  mainForm: FormGroup;

  pad = (i: number): string => i < 10 ? `0${i}` : `${i}`;
  asIsOrder = (a, b) => 1;

  private propagateChange = (_: any) => { };

  constructor(
    public dateFormatter: NgbDateParserFormatter,
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder
  ) {
    this.scheduleData = new Schedule(null, null, null, null, null, null, null, null);
  }

  ngOnInit(): void {
    this.minDate = this.calendar.getToday();

    this.mainForm = this.formBuilder.group({
      activeTab: 'onetime',
      selectedDate: this.calendar.getToday(),
      toDate:  this.calendar.getNext(this.calendar.getToday(), 'd', 10),
      selectedTime: {hour: 12, minute: 0, second: 0},
      selectedRepeatPeriod: 'week',
      weekGroupForm: this.formBuilder.group({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false
      }),
      monthYearGroupForm: this.formBuilder.group({
        selectedMonthType: 'monthday',
        selectedYearType: 'monthday'
      })
    });
    this.mainForm.get('weekGroupForm').get(this.calendar.getWeekday(this.mainForm.controls.selectedDate.value).toString()).setValue(true);

    this.formatRepeat();
    this.formatRepeatMonthType();
    this.mainForm.get('weekGroupForm').valueChanges.subscribe(() => {
      this.updateWeekPeriod();
      this.formatRepeat();
    });
    this.mainForm.get('monthYearGroupForm').valueChanges.subscribe(() => this.formatRepeat());
  }

  changeRepeatPeriod(newRepeatPeriod: string) {
    this.updatePeriod(newRepeatPeriod);
    this.mainForm.controls.selectedRepeatPeriod.setValue(newRepeatPeriod);
    this.formatRepeat();
  }

  onDateSelection(date: NgbDate) {
    if (!this.mainForm.get('selectedDate').value && !this.mainForm.get('toDate').value) {
      this.mainForm.get('selectedDate').setValue(date);
    } else if (this.mainForm.get('selectedDate').value && !this.mainForm.get('toDate').value && date.after(this.mainForm.get('selectedDate').value)) {
      this.mainForm.get('toDate').setValue(date);
    } else {
      this.mainForm.get('toDate').setValue(null);
      this.mainForm.get('selectedDate').setValue(date);
    }
  }

  isHovered(date: NgbDate) {
    return this.mainForm.get('selectedDate').value && !this.mainForm.get('toDate').value && this.hoveredDate && date.after(this.mainForm.get('selectedDate').value) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.mainForm.get('toDate').value && date.after(this.mainForm.get('selectedDate').value) && date.before(this.mainForm.get('toDate').value);
  }

  isRange(date: NgbDate) {
    return date.equals(this.mainForm.get('selectedDate').value) || (this.mainForm.get('toDate').value && date.equals(this.mainForm.get('toDate').value) || this.isInside(date) || this.isHovered(date));
  }

  formatRepeatMonthType(): string {
    const date: string = this.dateFormatter.format(this.mainForm.get('selectedDate').value);
    return Schedule.getWeekOfMonth(date) + ' ' + Schedule.getWeekDayNameFromDate(date);
  }

  formatRepeatYearType(isSpecificDate: boolean): string {
    const date: string = this.dateFormatter.format(this.mainForm.get('selectedDate').value);
    if (isSpecificDate) {
      return Schedule.getMonthDateNameFromDate(date);
    }
    return Schedule.getWeekOfMonth(date) + ' ' + Schedule.getWeekDayNameFromDate(date) + ' of ' + Schedule.getMonthNameFromDate(date);
  }

  writeValue(obj: any) {
    if (obj) {
      this.scheduleData.from(obj);
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }

  private updatePeriod(newRepeatPeriod: string): void {
    if (newRepeatPeriod == 'day') {
      Object.keys(this.mainForm.get('weekGroupForm').controls).forEach(key => {
        this.mainForm.get('weekGroupForm').controls[key].setValue(true);
      });
    } else if (newRepeatPeriod == 'week') {
      Object.keys(this.mainForm.get('weekGroupForm').controls).forEach(key => {
        if (+key == this.calendar.getWeekday(this.mainForm.get('selectedDate').value)) {
          this.mainForm.get('weekGroupForm').controls[key].setValue(true);
        } else {
          this.mainForm.get('weekGroupForm').controls[key].setValue(false);
        }
      });
    }
  }

  private updateWeekPeriod(): void {
    let allDay = true;
    Object.keys(this.mainForm.get('weekGroupForm').controls).forEach(key => {
      if (!this.mainForm.get('weekGroupForm').controls[key].value) {
        allDay = false;
      }
    });
    if (allDay) {
      this.mainForm.get('selectedRepeatPeriod').setValue('day');
    } else {
      this.mainForm.get('selectedRepeatPeriod').setValue('week');
    }
  }

  private formatRepeat(): void {
    let result: string = '';

    if (this.mainForm.get('selectedRepeatPeriod').value == 'day') {
      result = 'day';
    } else if (this.mainForm.get('selectedRepeatPeriod').value == 'week') {
      let allDay = true;
      Object.keys(this.mainForm.get('weekGroupForm').controls).forEach(key => {
        if (this.mainForm.get('weekGroupForm').controls[key].value) {
          result += Schedule.getWeekDayName(+key) + ', ';
        } else {
          allDay = false;
        }
      });
      if (allDay) {
        result = 'day';
      } else {
        result = result.slice(0, -2);
      }
    } else if (this.mainForm.get('selectedRepeatPeriod').value == 'month') {
      if (this.mainForm.get('monthYearGroupForm').get('selectedMonthType').value == 'monthday') {
        result = this.mainForm.get('selectedDate').value.day.toString();
      } else {
        result = this.formatRepeatMonthType();
      }
    } else if (this.mainForm.get('selectedRepeatPeriod').value == 'year') {
      result = this.formatRepeatYearType(this.mainForm.get('monthYearGroupForm').get('selectedYearType').value == 'monthday');
    }

    this.repeatFormat = 'every ' + result;
  }
}
