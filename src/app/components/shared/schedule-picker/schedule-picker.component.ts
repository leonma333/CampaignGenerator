import { Component, OnInit, forwardRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { Schedule } from '../../../models/schedule';

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

  padTime = Schedule.padTime;

  private scheduleData: Schedule;
  private propagateChange = (_: any) => { };

  constructor(
    public dateFormatter: NgbDateParserFormatter,
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder
  ) {
    this.scheduleData = new Schedule(null, null, null, null, null, null, null, null);
  }

  asIsOrder = (a, b) => 1;

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
    this.mainForm.valueChanges.subscribe(() => this.output());
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
    } else if (this.mainForm.get('selectedDate').value && !this.mainForm.get('toDate').value
      && date.after(this.mainForm.get('selectedDate').value)) {
      this.mainForm.get('toDate').setValue(date);
    } else {
      this.mainForm.get('toDate').setValue(null);
      this.mainForm.get('selectedDate').setValue(date);
    }
  }

  isHovered(date: NgbDate) {
    return this.mainForm.get('selectedDate').value && !this.mainForm.get('toDate').value && this.hoveredDate
      && date.after(this.mainForm.get('selectedDate').value) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.mainForm.get('toDate').value && date.after(this.mainForm.get('selectedDate').value) && date.before(this.mainForm.get('toDate').value);
  }

  isRange(date: NgbDate) {
    return date.equals(this.mainForm.get('selectedDate').value) || (this.mainForm.get('toDate').value && date.equals(this.mainForm.get('toDate').value) || this.isInside(date) || this.isHovered(date));
  }

  formatRepeatMonthType(): string {
    const date: string = this.dateFormatter.format(this.mainForm.get('selectedDate').value);
    return Schedule.getWeekOfMonthNameFromDate(date) + ' ' + Schedule.getWeekDayNameFromDate(date);
  }

  formatRepeatYearType(isSpecificDate: boolean): string {
    const date: string = this.dateFormatter.format(this.mainForm.get('selectedDate').value);
    if (isSpecificDate) {
      return Schedule.getMonthDateNameFromDate(date);
    }
    return Schedule.getWeekOfMonthNameFromDate(date) + ' ' + Schedule.getWeekDayNameFromDate(date) + ' of '
      + Schedule.getMonthNameFromDate(date);
  }

  writeValue(obj: any) {
    if (obj) {
      this.mainForm.patchValue({
        activeTab: obj.type || this.mainForm.get('activeTab').value,
        selectedDate: obj.dateStart || this.mainForm.get('selectedDate').value,
        toDate: obj.dateEnd,
        selectedTime: obj.time || this.mainForm.get('selectedTime').value,
        selectedRepeatPeriod: obj.repeat || this.mainForm.get('selectedRepeatPeriod').value,
      });
      if (obj.weekDays) {
        for (let i = 1; i <= 7; i++) {
          if (obj.weekDays.includes(i)) {
            this.mainForm.get('weekGroupForm').get(i.toString()).setValue(true);
          } else {
            this.mainForm.get('weekGroupForm').get(i.toString()).setValue(false);
          }
        }
      } else if (obj.monthDay) {
        const selectedType = obj.monthDay.number === null ? 'monthday' : 'weekday';
        this.mainForm.get('monthYearGroupForm').get('selectedMonthType').setValue(selectedType);
      } else if (obj.yearDay) {
        const selectedType = obj.yearDay.number === null ? 'monthday' : 'weekday';
        this.mainForm.get('monthYearGroupForm').get('selectedYearType').setValue(selectedType);
      } else {
        this.updatePeriod(this.mainForm.get('selectedRepeatPeriod').value);
      }
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }

  private getWeekGroupControls() {
    return (this.mainForm.get('weekGroupForm') as FormArray).controls;
  }

  private output() {
    this.scheduleData.setType(this.mainForm.get('activeTab').value);
    this.scheduleData.dateStart = this.mainForm.get('selectedDate').value;
    this.scheduleData.dateEnd = this.mainForm.get('toDate').value;
    this.scheduleData.time = this.mainForm.get('selectedTime').value;
    this.scheduleData.setRepeat(this.mainForm.get('selectedRepeatPeriod').value);

    const weekDays = new Array<number>();
    const controls = this.getWeekGroupControls();
    Object.keys(controls).forEach(key => {
      if (controls[key].value) {
        weekDays.push(+key);
      }
    });
    this.scheduleData.weekDays = weekDays;

    const date: string = this.dateFormatter.format(this.scheduleData.dateStart);
    let selectType = this.mainForm.get('monthYearGroupForm').get('selectedMonthType').value;
    if (this.scheduleData.repeat === 'month') {
      this.scheduleData.monthDay = {
        day: selectType === 'weekday' ? this.calendar.getWeekday(this.scheduleData.dateStart) : null,
        number: selectType === 'weekday' ? Schedule.getWeekOfMonth(date) : null,
        month: null
      };
    } else {
      this.scheduleData.monthDay = null;
    }

    selectType = this.mainForm.get('monthYearGroupForm').get('selectedYearType').value;
    if (this.scheduleData.repeat === 'year') {
      this.scheduleData.yearDay = {
        month: selectType === 'weekday' ? this.scheduleData.dateStart.month : null,
        day: selectType === 'weekday' ? this.scheduleData.dateStart.day : null,
        number: selectType === 'weekday' ? Schedule.getWeekOfMonth(date) : null
      };
    } else {
      this.scheduleData.yearDay = null;
    }

    this.propagateChange(this.scheduleData.value());
  }

  private updatePeriod(newRepeatPeriod: string): void {
    const controls = this.getWeekGroupControls();
    if (newRepeatPeriod === 'day') {
      Object.keys(controls).forEach(key => {
        controls[key].setValue(true);
      });
    } else if (newRepeatPeriod === 'week') {
      Object.keys(controls).forEach(key => {
        if (+key === this.calendar.getWeekday(this.mainForm.get('selectedDate').value)) {
          controls[key].setValue(true);
        } else {
          controls[key].setValue(false);
        }
      });
    }
  }

  private updateWeekPeriod(): void {
    let allDay = true;
    const controls = this.getWeekGroupControls();
    Object.keys(controls).forEach(key => {
      if (!controls[key].value) {
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
    let result = '';
    if (this.mainForm.get('selectedRepeatPeriod').value === 'day') {
      result = 'day';
    } else if (this.mainForm.get('selectedRepeatPeriod').value === 'week') {
      const controls = this.getWeekGroupControls();
      Object.keys(controls).forEach(key => {
        if (controls[key].value) {
          result += Schedule.getWeekDayName(+key) + ', ';
        }
      });
      result = result.slice(0, -2);
    } else if (this.mainForm.get('selectedRepeatPeriod').value === 'month') {
      if (this.mainForm.get('monthYearGroupForm').get('selectedMonthType').value === 'monthday') {
        result = this.mainForm.get('selectedDate').value.day.toString();
      } else {
        result = this.formatRepeatMonthType();
      }
    } else if (this.mainForm.get('selectedRepeatPeriod').value === 'year') {
      result = this.formatRepeatYearType(this.mainForm.get('monthYearGroupForm').get('selectedYearType').value === 'monthday');
    }

    this.repeatFormat = 'every ' + result;
  }
}
