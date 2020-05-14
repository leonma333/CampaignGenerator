import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';

import * as moment from 'moment';
import { NgbModule, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { SchedulePickerComponent } from './schedule-picker.component';

describe('SchedulePickerComponent', () => {
  let component: SchedulePickerComponent;
  let fixture: ComponentFixture<SchedulePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, FormsModule, NgbModule ],
      providers: [ FormBuilder, NgbCalendar, NgbDateParserFormatter ],
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
  });
});
