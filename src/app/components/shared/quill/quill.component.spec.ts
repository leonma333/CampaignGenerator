import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';

import { QuillModule, QuillEditorComponent } from 'ngx-quill';

import { QuillComponent } from './quill.component';

@Component({
  template: '<app-quill [formControl]="content"></app-quill>'
})
class TestDataQuillComponent {
  @ViewChild(QuillComponent)
  quillComponent: QuillComponent;
  content: FormControl = new FormControl({ops: [{insert: 'Hello world!'}]});
}

describe('Component: QuillComponent', () => {
  function expectEditorContent(content: string, fixture: ComponentFixture<any>) {
    const editorEl = fixture.nativeElement.querySelector('.ql-editor');
    expect(editorEl.innerText.trim()).toBe(content);
  }

  describe('no input', () => {
    let component: QuillComponent;
    let fixture: ComponentFixture<QuillComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [ QuillModule.forRoot(), ReactiveFormsModule ],
        declarations: [ QuillComponent, QuillEditorComponent ]
      })
      .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(QuillComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
      expect(component.content.value).toBeNull();
      expectEditorContent('', fixture);
    });

    it('add emoji', () => {
      component.content.setValue({ops: [{insert: {emoji: 'dog'}}]});
      fixture.detectChanges();
      expectEditorContent('\u{1F436}', fixture);
    });
  });

  describe('with input', () => {
    let component: TestDataQuillComponent;
    let fixture: ComponentFixture<TestDataQuillComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [ QuillModule.forRoot(), ReactiveFormsModule ],
        declarations: [ TestDataQuillComponent, QuillComponent ]
      })
      .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestDataQuillComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component.quillComponent).toBeTruthy();
      expect(component.quillComponent.content.value).toEqual({ops: [{insert: 'Hello world!'}]});
      expectEditorContent('Hello world!', fixture);
    });
  });
});
