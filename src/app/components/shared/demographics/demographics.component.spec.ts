import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { DEFAULT_COUNTRIES } from '../../../models/demographic';
import { DemographicsComponent } from './demographics.component';
import { DigitOnlyDirective } from '../../../directives/digit-only.directive';

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
      expect(component.mainForm.controls.countries.value.map(country => country.id)).toEqual(
        jasmine.arrayWithExactContents(DEFAULT_COUNTRIES.filter(country => country !== 'GB'))
      );
    });
  });
});
