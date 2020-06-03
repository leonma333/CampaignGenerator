import { Component, OnInit, AfterViewInit, forwardRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MultiSelectComponent } from 'ng-multiselect-dropdown';

import { COUNTRIES } from '../../../constants';
import { Demographic, DEFAULT_COUNTRIES } from '../../../models/demographic';

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
export class DemographicsComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @ViewChild(MultiSelectComponent) multiSelect: MultiSelectComponent;

  mainForm: FormGroup;

  countries = [];
  countrySettings = {};

  private selectedCountries = [];

  private demographicData = new Demographic(null, null, null, null);
  private propagateChange = (_: any) => { };

  constructor(private formBuilder: FormBuilder) {
    for (const [key, value] of Object.entries(COUNTRIES)) {
      this.countries.push({id: key, name: value});
      if (DEFAULT_COUNTRIES.includes(key)) {
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
      minAge: 0,
      maxAge: 100,
      countries: [this.selectedCountries]
    });

    this.mainForm.valueChanges.subscribe(() => this.output());
  }

  ngAfterViewInit() {
    // HACK: prevent closing the dropdown due to the first clickOutside
    const originalClose = this.multiSelect.closeDropdown;
    this.multiSelect.closeDropdown = () => {};
    setTimeout(() => this.multiSelect.closeDropdown = originalClose, 500);
  }

  writeValue(obj: any) {
    if (obj) {
      const countries = obj.countries ? obj.countries.map(country => {
        return {id: country, name: COUNTRIES[country]};
      }) : DEFAULT_COUNTRIES.map(country => {
        return {id: country, name: COUNTRIES[country]};
      });
      this.mainForm.patchValue({
        gender: obj.gender || this.mainForm.get('gender').value,
        minAge: obj.minAge || this.mainForm.get('minAge').value,
        maxAge: obj.maxAge || this.mainForm.get('maxAge').value,
        countries
      });
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }

  private output() {
    this.demographicData.setGender(this.mainForm.get('gender').value);
    this.demographicData.minAge = parseInt(this.mainForm.get('minAge').value, 10);
    this.demographicData.maxAge = parseInt(this.mainForm.get('maxAge').value, 10);
    this.demographicData.countries = this.mainForm.get('countries').value.map(country => country.id);

    this.propagateChange(this.demographicData.value());
  }
}
