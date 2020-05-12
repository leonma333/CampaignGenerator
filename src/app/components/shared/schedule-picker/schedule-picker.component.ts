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

  activeTab = 'onetime';
  minDate: NgbDate;
  selectedDate: NgbDate;
  selectedTime: NgbTimeStruct = {hour: 12, minute: 0, second: 0};

  hoveredDate: NgbDate | null = null;
  toDate: NgbDate | null = null;

  repeatPeriods = {
    day: 'Every day',
    week: 'Every week',
    month: 'Every month',
    year: 'Every year'
  };
  repeatFormat: string;
  selectedRepeatPeriod: string;
  weekGroupForm: FormGroup;
  monthYearGroupForm: FormGroup;

  pad = (i: number): string => i < 10 ? `0${i}` : `${i}`;
  asIsOrder = (a, b) => 1;

  private now = new Date();
  private propagateChange = (_: any) => { };

  constructor(
    public dateFormatter: NgbDateParserFormatter,
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder
  ) {
    this.scheduleData = new Schedule(this.activeTab, this.selectedDate, this.toDate, this.selectedTime,
      this.selectedRepeatPeriod, [], null, null);
  }

  ngOnInit(): void {
    this.minDate = this.calendar.getToday();
    this.selectedDate = this.calendar.getToday();
    this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 10);
    this.selectedRepeatPeriod = 'week';
    this.weekGroupForm = this.formBuilder.group({
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false
    });
    this.weekGroupForm.controls[this.calendar.getWeekday(this.selectedDate)].setValue(true);
    this.monthYearGroupForm = this.formBuilder.group({
      selectedMonthType: 'monthday',
      selectedYearType: 'monthday'
    });
    this.formatRepeat();
    this.formatRepeatMonthType();
    this.weekGroupForm.valueChanges.subscribe(() => {
      this.updateWeekPeriod();
      this.formatRepeat();
    });
    this.monthYearGroupForm.valueChanges.subscribe(() => {
      this.formatRepeat();
    });
  }

  changeRepeatPeriod(newRepeatPeriod: string) {
    this.updatePeriod(newRepeatPeriod);
    this.selectedRepeatPeriod = newRepeatPeriod;
    this.formatRepeat();
  }

  onDateSelection(date: NgbDate) {
    if (!this.selectedDate && !this.toDate) {
      this.selectedDate = date;
    } else if (this.selectedDate && !this.toDate && date.after(this.selectedDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.selectedDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.selectedDate && !this.toDate && this.hoveredDate && date.after(this.selectedDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.selectedDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.selectedDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  formatRepeatMonthType(): string {
    const date: string = this.dateFormatter.format(this.selectedDate);
    return Schedule.getWeekOfMonth(date) + ' ' + Schedule.getWeekDayNameFromDate(date);
  }

  formatRepeatYearType(isSpecificDate: boolean): string {
    const date: string = this.dateFormatter.format(this.selectedDate);
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
      Object.keys(this.weekGroupForm.controls).forEach(key => {
        this.weekGroupForm.controls[key].setValue(true);
      });
    } else if (newRepeatPeriod == 'week') {
      Object.keys(this.weekGroupForm.controls).forEach(key => {
        if (+key == this.calendar.getWeekday(this.selectedDate)) {
          this.weekGroupForm.controls[key].setValue(true);
        } else {
          this.weekGroupForm.controls[key].setValue(false);
        }
      });
    }
  }

  private updateWeekPeriod(): void {
    let allDay = true;
    Object.keys(this.weekGroupForm.controls).forEach(key => {
      if (!this.weekGroupForm.controls[key].value) {
        allDay = false;
      }
    });
    if (allDay) {
      this.selectedRepeatPeriod = 'day';
    } else {
      this.selectedRepeatPeriod = 'week';
    }
  }

  private formatRepeat(): void {
    let result: string = '';

    if (this.selectedRepeatPeriod == 'day') {
      result = 'day';
    } else if (this.selectedRepeatPeriod == 'week') {
      let allDay = true;
      Object.keys(this.weekGroupForm.controls).forEach(key => {
        if (this.weekGroupForm.controls[key].value) {
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
    } else if (this.selectedRepeatPeriod == 'month') {
      if (this.monthYearGroupForm.controls.selectedMonthType.value == 'monthday') {
        result = this.selectedDate.day.toString();
      } else {
        result = this.formatRepeatMonthType();
      }
    } else if (this.selectedRepeatPeriod == 'year') {
      result = this.formatRepeatYearType(this.monthYearGroupForm.controls.selectedYearType.value == 'monthday');
    }

    this.repeatFormat = 'every ' + result;
  }
}
