import { Component, OnInit, forwardRef } from '@angular/core';
import { FormBuilder, FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-demographics',
  templateUrl: './demographics.component.html',
  styleUrls: ['./demographics.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DemographicsComponent),
      multi: true,
    }
  ]
})
export class DemographicsComponent implements OnInit {
	mainForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  	this.mainForm = this.formBuilder.group({
      gender: 'neutral',
      age_min: 0,
      age_max: 100
    });
  }

}
