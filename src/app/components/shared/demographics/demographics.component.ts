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
  countrySettings: object;

  countries = [
    {id: 'US', name: 'United States'},
    {id: 'CA', name: 'Canada'}
  ]

  constructor(private formBuilder: FormBuilder) {
    this.countrySettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  ngOnInit(): void {
    this.mainForm = this.formBuilder.group({
      gender: 'neutral',
      age_min: 0,
      age_max: 100,
      country: [[]]
    });
  }

  onCountrySelect(country: any) {
    console.log(country);
  }

}
