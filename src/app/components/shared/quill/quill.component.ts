import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import Quill from 'quill';
import 'quill-emoji/dist/quill-emoji.js';

import ImageResize from 'quill-image-resize-module';
Quill.register('modules/imageResize', ImageResize);

const BaseImageFormat = Quill.import('formats/image');
const ImageFormatAttributesList = [
    'alt',
    'height',
    'width',
    'style'
];
class ImageFormat extends BaseImageFormat {
  static formats(domNode) {
    return ImageFormatAttributesList.reduce((formats, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }
  format(name, value) {
    if (ImageFormatAttributesList.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}
Quill.register(ImageFormat, true);

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
      imageResize: true,
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{header: 1 }, {header: 2 }],
          [{list: 'ordered' }, {list: 'bullet' }],
          [{script: 'sub' }, {script: 'super' }],
          [{indent: '-1' }, {indent: '+1' }],
          [{direction: 'rtl' }],
          [{header: [1, 2, 3, 4, 5, 6, false]}],
          [{color: []}, {background: []}],
          [{font: []}],
          [{align: []}],
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

  initializeQuill(quill: any) {
    const tooltip = quill.theme.tooltip;
    tooltip.textbox.setAttribute('data-image', 'Image URL');

    const imageHandler = () => {
      const originalSave = tooltip.save;
      tooltip.save = () => {
        const range = quill.getSelection(true);
        const value = tooltip.textbox.value;
        if (value) {
          quill.insertEmbed(range.index, 'image', value, 'user');
        }
        tooltip.save = originalSave;
      };
      tooltip.edit('image');
    };
    const toolbar = quill.getModule('toolbar');
    toolbar.addHandler('image', imageHandler);
  }
}
