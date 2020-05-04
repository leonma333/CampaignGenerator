import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalConfirmComponent } from './modal-confirm.component';

describe('Component: ModalConfirmComponent', () => {
  let component: ModalConfirmComponent;
  let fixture: ComponentFixture<ModalConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfirmComponent ],
      providers: [ NgbActiveModal ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display inputs', () => {
    component.title = 'My Campaign';
    component.question = 'Are you sure?';
    component.note = 'This operation is important';
    component.irreversible = false;

    fixture.detectChanges();

    const de: DebugElement = fixture.debugElement;
    const titleEl :DebugElement = de.query(By.css('.modal-title'));
    const questionEl :DebugElement = de.query(By.css('.modal-question'));
    const noteEl :DebugElement = de.query(By.css('.modal-note'));

    expect(titleEl.nativeElement.textContent).toBe('My Campaign');
    expect(questionEl.nativeElement.textContent).toBe('Are you sure?');
    expect(noteEl.nativeElement.textContent).toMatch(/This operation is important/);
  });

  it('should dismiss modal with close', () => {
    const activeModel = TestBed.get(NgbActiveModal);
    spyOn(activeModel, 'dismiss');

    const de: DebugElement = fixture.debugElement;
    const closeEl: DebugElement = de.query(By.css('button.close'));

    closeEl.nativeElement.click();
    fixture.detectChanges();
    expect(activeModel.dismiss).toHaveBeenCalledWith(false);
    expect(activeModel.dismiss.calls.count()).toEqual(1);
  });

  it('should dismiss modal with cancel', () => {
    const activeModel = TestBed.get(NgbActiveModal);
    spyOn(activeModel, 'dismiss');

    const de: DebugElement = fixture.debugElement;
    const closeEl: DebugElement = de.query(By.css('button.cancel'));

    closeEl.nativeElement.click();
    fixture.detectChanges();
    expect(activeModel.dismiss).toHaveBeenCalledWith(false);
    expect(activeModel.dismiss.calls.count()).toEqual(1);
  });

  it('should close modal with confirm', () => {
    const activeModel = TestBed.get(NgbActiveModal);
    spyOn(activeModel, 'close');

    const de: DebugElement = fixture.debugElement;
    const closeEl: DebugElement = de.query(By.css('button.confirm'));

    closeEl.nativeElement.click();
    fixture.detectChanges();
    expect(activeModel.close).toHaveBeenCalledWith(true);
    expect(activeModel.close.calls.count()).toEqual(1);
  });
});
