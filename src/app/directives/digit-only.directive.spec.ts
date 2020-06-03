import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { DigitOnlyDirective } from './digit-only.directive';

@Component({
    template: `<input type="text" appDigitOnly>`
})
class TestDigitOnlyComponent {
}

describe('DigitOnlyDirective', () => {
  let component: TestDigitOnlyComponent;
  let fixture: ComponentFixture<TestDigitOnlyComponent>;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestDigitOnlyComponent, DigitOnlyDirective]
    });
    fixture = TestBed.createComponent(TestDigitOnlyComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
  });
});
