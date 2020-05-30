import { Component, OnInit, AfterViewInit, forwardRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MultiSelectComponent } from 'ng-multiselect-dropdown';

import { COUNTRIES } from '../../../constants';

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
export class DemographicsComponent implements OnInit, AfterViewInit {
  @ViewChild(MultiSelectComponent) multiSelect: MultiSelectComponent;

  mainForm: FormGroup;

  countries = [];
  countrySettings = {};
  
  private defaultCountries = ['CA', 'US', 'JP', 'UK', 'DE', 'CN', 'TW', 'HK'];
  private selectedCountries = [];

  constructor(private formBuilder: FormBuilder) {
    for (let [key, value] of Object.entries(COUNTRIES)) {
      this.countries.push({id: key, name: value});
      if (this.defaultCountries.includes(key)) {
        this.selectedCountries.push({id: key, name: value});
      }
    }
  }

  ngOnInit(): void {
    this.countrySettings = {
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      singleSelection: false,
      defaultOpen: true,
      allowSearchFilter: true,
      showSelectedItemsAtTop: true
    };
    this.mainForm = this.formBuilder.group({
      gender: 'neutral',
      age_min: 0,
      age_max: 100,
      countries: [this.selectedCountries]
    });
  }

  ngAfterViewInit() {
    this.multiSelect.closeDropdown = () => {};
  }
}
