import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild, DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { DEFAULT_COUNTRIES } from '../../../models/demographic';
import { DemographicsComponent } from './demographics.component';
import { DigitOnlyDirective } from '../../../directives/digit-only.directive';

@Component({
  template: '<app-demographics [formControl]="demographicData"></app-demographics>'
})
class TestDefaultDemographicComponent {
  @ViewChild(DemographicsComponent)
  demographicsComponent: DemographicsComponent;
  demographicData: FormControl = new FormControl({});
}

@Component({
  template: '<app-demographics [formControl]="demographicData"></app-demographics>'
})
class TestDemographicComponent {
  @ViewChild(DemographicsComponent)
  demographicsComponent: DemographicsComponent;
  demographicData: FormControl = new FormControl({
    gender: 'male',
    minAge: 20,
    maxAge: 80,
    countries: ['PE', 'JP', 'SG', 'KR']
  });
}

describe('Component: DemographicsComponent', () => {
  function changeGender(gender: string, fixture: ComponentFixture<any>) {
    const genderEl: DebugElement = fixture.debugElement.query(By.css(`input[value="${gender}"]`));
    genderEl.nativeElement.click();
  }

  function changeMinAge(age: number, fixture: ComponentFixture<any>) {
    const minAgeEl: DebugElement = fixture.debugElement.query(By.css(`input.min-age`));
    minAgeEl.nativeElement.value = age.toString();
    minAgeEl.triggerEventHandler('input', { target: minAgeEl.nativeElement });
  }

  function changeMaxAge(age: number, fixture: ComponentFixture<any>) {
    const minAgeEl: DebugElement = fixture.debugElement.query(By.css(`input.max-age`));
    minAgeEl.nativeElement.value = age.toString();
    minAgeEl.triggerEventHandler('input', { target: minAgeEl.nativeElement });
  }

  function deleteCountry(country: string, fixture: ComponentFixture<any>) {
    const countriesEl: Array<DebugElement> = fixture.debugElement.queryAll(By.css('.selected-item'));
    for (const el of countriesEl) {
      if (el.nativeElement.innerText.startsWith(country)) {
        el.query(By.css('a')).nativeElement.click();
        break;
      }
    }
  }

  function addCountry(country: string, fixture: ComponentFixture<any>) {
    const dropdownEl: DebugElement = fixture.debugElement.query(By.css('.dropdown-list'));
    if (dropdownEl.nativeElement.hasAttribute('hidden')) {
      const dropdownButtonEl: DebugElement = fixture.debugElement.query(By.css('.dropdown-btn'));
      dropdownButtonEl.nativeElement.click();
      fixture.detectChanges();
    }
    const searchEl: DebugElement = fixture.debugElement.query(By.css('input[aria-label="multiselect-search"]'));
    searchEl.nativeElement.value = country;
    searchEl.triggerEventHandler('input', { target: searchEl.nativeElement });
    fixture.detectChanges();

    const countryEl: DebugElement = fixture.debugElement.query(By.css('ul.item2 .multiselect-item-checkbox'));
    countryEl.nativeElement.click();
  }

  describe('no input', () => {
    let component: DemographicsComponent;
    let fixture: ComponentFixture<DemographicsComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [ ReactiveFormsModule, NgbModule, NgMultiSelectDropDownModule.forRoot() ],
        declarations: [ DemographicsComponent, DigitOnlyDirective ]
      })
      .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(DemographicsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
      expect(component.mainForm.controls.gender.value).toBe('neutral');
      expect(component.mainForm.controls.minAge.value).toBe(0);
      expect(component.mainForm.controls.maxAge.value).toBe(100);
      expect(component.mainForm.controls.countries.value.map(country => country.id)).toEqual(
        jasmine.arrayWithExactContents(DEFAULT_COUNTRIES)
      );
    });

    it('change gender', () => {
      changeGender('male', fixture);
      fixture.detectChanges();
      expect(component.mainForm.controls.gender.value).toEqual('male');
    });

    it('change age', () => {
      changeMinAge(20, fixture);
      fixture.detectChanges();
      expect(parseInt(component.mainForm.controls.minAge.value, 10)).toEqual(20);

      changeMaxAge(80, fixture);
      fixture.detectChanges();
      expect(parseInt(component.mainForm.controls.maxAge.value, 10)).toEqual(80);
    });

    it('change country', () => {
      deleteCountry('United Kingdom', fixture);
      fixture.detectChanges();
      const countries = DEFAULT_COUNTRIES.filter(country => country !== 'GB');
      expect(component.mainForm.controls.countries.value.map(country => country.id)).toEqual(
        jasmine.arrayWithExactContents(countries)
      );
      addCountry('Australia', fixture);
      fixture.detectChanges();
      countries.push('AU');
      expect(component.mainForm.controls.countries.value.map(country => country.id)).toEqual(
        jasmine.arrayWithExactContents(countries)
      );
    });
  });

  describe('with empty input', () => {
    let component: TestDefaultDemographicComponent;
    let fixture: ComponentFixture<TestDefaultDemographicComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [ ReactiveFormsModule, NgbModule, NgMultiSelectDropDownModule.forRoot() ],
        declarations: [ TestDefaultDemographicComponent, DemographicsComponent, DigitOnlyDirective ]
      })
      .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestDefaultDemographicComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component.demographicsComponent).toBeTruthy();
      expect(component.demographicsComponent.mainForm.controls.gender.value).toBe('neutral');
      expect(component.demographicsComponent.mainForm.controls.minAge.value).toBe(0);
      expect(component.demographicsComponent.mainForm.controls.maxAge.value).toBe(100);
      expect(component.demographicsComponent.mainForm.controls.countries.value.map(country => country.id)).toEqual(
         jasmine.arrayWithExactContents(DEFAULT_COUNTRIES)
      );
    });

    it('change gender', () => {
      changeGender('male', fixture);
      fixture.detectChanges();
      expect(component.demographicData.value.gender).toEqual('male');
    });

    it('change age', () => {
      changeMinAge(20, fixture);
      fixture.detectChanges();
      expect(component.demographicData.value.minAge).toEqual(20);

      changeMaxAge(80, fixture);
      fixture.detectChanges();
      expect(component.demographicData.value.maxAge).toEqual(80);
    });

    it('change country', () => {
      deleteCountry('United Kingdom', fixture);
      fixture.detectChanges();
      const countries = DEFAULT_COUNTRIES.filter(country => country !== 'GB');
      expect(component.demographicData.value.countries).toEqual(
        jasmine.arrayWithExactContents(countries)
      );
      addCountry('Australia', fixture);
      fixture.detectChanges();
      countries.push('AU');
      expect(component.demographicData.value.countries).toEqual(
        jasmine.arrayWithExactContents(countries)
      );
    });
  });

  describe('with non-empty input', () => {
    let component: TestDemographicComponent;
    let fixture: ComponentFixture<TestDemographicComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [ ReactiveFormsModule, NgbModule, NgMultiSelectDropDownModule.forRoot() ],
        declarations: [ TestDemographicComponent, DemographicsComponent, DigitOnlyDirective ]
      })
      .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestDemographicComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component.demographicsComponent).toBeTruthy();
      expect(component.demographicsComponent.mainForm.controls.gender.value).toBe('male');
      expect(component.demographicsComponent.mainForm.controls.minAge.value).toBe(20);
      expect(component.demographicsComponent.mainForm.controls.maxAge.value).toBe(80);
      expect(component.demographicsComponent.mainForm.controls.countries.value.map(country => country.id)).toEqual(
        jasmine.arrayWithExactContents(['PE', 'JP', 'SG', 'KR'])
      );
    });
  });
});
