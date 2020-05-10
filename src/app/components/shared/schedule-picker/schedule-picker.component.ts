import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms'

import { NgbCalendar, NgbDate, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

import { Schedule } from '../../../models/schedule';

@Component({
  selector: 'app-schedule-picker',
  templateUrl: './schedule-picker.component.html',
  styleUrls: ['./schedule-picker.component.scss']
})
export class SchedulePickerComponent implements OnInit {
  activeTab = 'onetime';

  minDate: NgbDate;
  selectedDate: NgbDate;
  selectedTime = {hour: 12, minute: 0};

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

  private now = new Date();

  constructor(
    public dateFormatter: NgbDateParserFormatter,
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder
  ) { }

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
    this.formatRepeat();
    this.weekGroupForm.valueChanges.subscribe(() => {
      this.updatePeriod();
      this.formatRepeat();
    });
  }

  pad = (i: number): string => i < 10 ? `0${i}` : `${i}`;

  changeRepeatPeriod(newRepeatPeriod: string) { 
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

  private updatePeriod(): void {
    let allDay = true;
    Object.keys(this.weekGroupForm.controls).forEach(key => {
      if (!this.weekGroupForm.controls[key].value) {
        allDay = false;
      }
    });
    if (allDay) {
      this.selectedRepeatPeriod = 'day';
    }
  }

  private formatRepeat(): void {
    let result: string = '';

    if (this.selectedRepeatPeriod == 'day') {
      result = 'day';
    } if (this.selectedRepeatPeriod == 'week') {
      let allDay = true;
      Object.keys(this.weekGroupForm.controls).forEach(key => {
        if (this.weekGroupForm.controls[key].value) {
          result += Schedule.getDayName(+key) + ', ';
        } else {
          allDay = false;
        }
      });
      result = result.slice(0, -2);
    }

    this.repeatFormat = 'every ' + result;
  }
}
