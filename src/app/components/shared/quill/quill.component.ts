import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import 'quill-emoji/dist/quill-emoji.js';

@Component({
  selector: 'app-quill',
  templateUrl: './quill.component.html',
  styleUrls: ['./quill.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuillComponent),
      multi: true,
    }
  ]
})
export class QuillComponent implements OnInit, ControlValueAccessor {
  @Input() styles: object;

  modules: object;
  content: FormControl = new FormControl(null);

  private propagateChange = (_: any) => { };

  constructor() {
    this.modules = {
      'emoji-shortname': true,
      'emoji-toolbar': true,
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{header: 1 }, {header: 2 }],
          [{list: 'ordered' }, {list: 'bullet' }],
          [{script: 'sub' }, {script: 'super' }],
          [{indent: '-1' }, {indent: '+1' }],
          [{direction: 'rtl' }],
          [{header: [1, 2, 3, 4, 5, 6, false] }],
          [{color: [] }, {background: [] }],
          [{font: [] }],
          [{align: [] }],
          ['clean'],
          ['emoji'],
          ['link', 'image', 'video']
        ]
      }
    };
  }

  ngOnInit(): void {
    this.content.valueChanges.subscribe(content => {
      this.propagateChange(content);
    });
  }

  writeValue(obj: any) {
    if (obj) {
      this.content.setValue(obj);
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }
}
