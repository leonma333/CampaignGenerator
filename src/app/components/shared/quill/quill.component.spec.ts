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
    },
    {
      insert: '${some_key}',
      attributes: {'dynamic-content': { key: 'some_key', style: 'border-style:dotted;border-width:1px;' }}
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
    expect(editorEl.textContent).toBe(content);
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

    it('add custom color', (done) => {
      new Promise(resolve => setTimeout(resolve, 1000)).then(() => { // wait for onEditorCreated
        const colorEl = fixture.nativeElement.querySelector('.ql-picker.ql-color .ql-picker-label');
        colorEl.click();
        fixture.detectChanges();
        const customColorEl = fixture.nativeElement.querySelector('.ql-picker.ql-color [data-value="custom-color"]');
        customColorEl.click();
        fixture.detectChanges();
        const rgbEl = fixture.nativeElement.querySelector('input[data-color="Hex/RGB/RGBA"]');
        rgbEl.value = 'rgb(47,183,236)';
        const saveEl = fixture.nativeElement.querySelector('.ql-tooltip .ql-action');
        saveEl.click();
        fixture.detectChanges();
        const spanColorEl = fixture.nativeElement.querySelector('.ql-editor span');
        expect(spanColorEl.getAttribute('style')).toBe('font-size: 14px; color: rgb(47, 183, 236);');
        done();
      });
    });

    it('add custom background color', (done) => {
      new Promise(resolve => setTimeout(resolve, 1000)).then(() => { // wait for onEditorCreated
        const backgroundEl = fixture.nativeElement.querySelector('.ql-picker.ql-background .ql-picker-label');
        backgroundEl.click();
        fixture.detectChanges();
        const customColorEl = fixture.nativeElement.querySelector('.ql-picker.ql-background [data-value="custom-color"]');
        customColorEl.click();
        fixture.detectChanges();
        const rgbEl = fixture.nativeElement.querySelector('input[data-background="Hex/RGB/RGBA"]');
        rgbEl.value = 'rgb(47,183,236)';
        const saveEl = fixture.nativeElement.querySelector('.ql-tooltip .ql-action');
        saveEl.click();
        fixture.detectChanges();
        const spanColorEl = fixture.nativeElement.querySelector('.ql-editor span');
        expect(spanColorEl.getAttribute('style')).toBe('font-size: 14px; background-color: rgb(47, 183, 236);');
        done();
      });
    });

    it('add spacing', (done) => {
      new Promise(resolve => setTimeout(resolve, 1000)).then(() => { // wait for onEditorCreated
        const spacingEl = fixture.nativeElement.querySelector('.ql-picker.ql-spacing .ql-picker-label');
        spacingEl.click();
        fixture.detectChanges();
        const customSpacingEl = fixture.nativeElement.querySelector('.ql-picker.ql-spacing [data-value="2"]');
        customSpacingEl.click();
        fixture.detectChanges();
        const pSpacingEl = fixture.nativeElement.querySelector('.ql-editor p');
        expect(pSpacingEl.getAttribute('style')).toBe('line-height: 2;');
        done();
      });
    });

    fit('add divider', (done) => {
      new Promise(resolve => setTimeout(resolve, 1000)).then(() => { // wait for onEditorCreated
        const dividerEl = fixture.nativeElement.querySelector('button.ql-divider');
        dividerEl.click();
        fixture.detectChanges();
        const hrDividerEls = fixture.nativeElement.querySelectorAll('.ql-editor hr');
        expect(hrDividerEls.length).toBe(1);
        done();
      });
    });

    it('add dynamic content', (done) => {
      new Promise(resolve => setTimeout(resolve, 1000)).then(() => { // wait for onEditorCreated
        const dynamicContentEl = fixture.nativeElement.querySelector('button.ql-dynamic-content');
        dynamicContentEl.click();
        fixture.detectChanges();
        const keyEl = fixture.nativeElement.querySelector('input[data-dynamic-content="Dynamic field key"]');
        keyEl.value = 'some_key';
        const saveEl = fixture.nativeElement.querySelector('.ql-tooltip .ql-action');
        saveEl.click();
        fixture.detectChanges();
        expect(Model.sanitize(component.content.value)).toEqual({
          ops: [{insert: '${some_key}', attributes: {'dynamic-content': {
            key: 'some_key', style: 'border-style:dotted;border-width:1px;' }
          }},
          {insert: '\n'}]
        });
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
      expectEditorContent('Hello world!${some_key}', fixture);

      const imageEl = fixture.nativeElement.querySelector('.ql-editor img');
      expect(imageEl.getAttribute('style')).toBe('display:block;margin:auto');

      const dynamicContentEl = fixture.nativeElement.querySelector('.ql-editor dynamic');
      expect(dynamicContentEl.getAttribute('key')).toBe('some_key');
      expect(dynamicContentEl.getAttribute('style')).toBe('border-style:dotted;border-width:1px;');
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
