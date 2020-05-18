import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';

import { QuillModule, QuillEditorComponent } from 'ngx-quill';

import { QuillComponent } from './quill.component';
import { Model } from '../../../models/model';

const displayContent1 = {
  ops: [
    {insert: 'Hello world!'},
    {insert: '\n'},
    {
      insert: {image: 'https://www.w3schools.com/angular/pic_angular.jpg'},
      attributes: {style: 'display:block;margin:auto', width: '300'}
    }
  ]
};

const displayContent2 = {
  ops: [
    {
      insert: {image: 'https://www.w3schools.com/angular/pic_angular.jpg'},
      attributes: {style: '', width: '300'}
    }
  ]
};

@Component({
  template: '<app-quill [formControl]="content"></app-quill>'
})
class TestDataQuillComponent {
  @ViewChild(QuillComponent)
  quillComponent: QuillComponent;
  content: FormControl = new FormControl(displayContent1);
}

@Component({
  template: '<app-quill [formControl]="content"></app-quill>'
})
class TestDataEmptyAttributeQuillComponent {
  @ViewChild(QuillComponent)
  quillComponent: QuillComponent;
  content: FormControl = new FormControl(displayContent2);
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

    it('add image', (done) => {
      new Promise(resolve => setTimeout(resolve, 1000)).then(() => { // wait for onEditorCreated
        const imageEl = fixture.nativeElement.querySelector('button.ql-image');
        imageEl.click();
        fixture.detectChanges();
        const urlEl = fixture.nativeElement.querySelector('input[data-image="Image URL"]');
        urlEl.value = 'image.jpg';
        const saveEl = fixture.nativeElement.querySelector('.ql-tooltip .ql-action');
        saveEl.click();
        fixture.detectChanges();
        expect(Model.sanitize(component.content.value)).toEqual({ops: [{insert: {image: 'image.jpg'}}, {insert: '\n'}]});
        done();
      });
    });
  });

  describe('with input', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [ QuillModule.forRoot(), ReactiveFormsModule ],
        declarations: [ TestDataQuillComponent, TestDataEmptyAttributeQuillComponent, QuillComponent ]
      })
      .compileComponents();
    }));

    it('should create', () => {
      const fixture = TestBed.createComponent(TestDataQuillComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.quillComponent).toBeTruthy();
      expect(component.quillComponent.content.value).toEqual(displayContent1);
      expectEditorContent('Hello world!', fixture);

      const imageEl = fixture.nativeElement.querySelector('.ql-editor img');
      expect(imageEl.getAttribute('style')).toBe('display:block;margin:auto');
    });

    it('empty attribute value should be removed', () => {
      const fixture = TestBed.createComponent(TestDataEmptyAttributeQuillComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.quillComponent).toBeTruthy();
      expect(component.quillComponent.content.value).toEqual(displayContent2);

      const imageEl = fixture.nativeElement.querySelector('.ql-editor img');
      expect(imageEl.getAttribute('style')).toBeNull();
    });
  });
});
