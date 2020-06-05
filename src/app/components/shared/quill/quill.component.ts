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
      const instance = this as any;
      if (value) {
        instance.domNode.setAttribute(name, value);
      } else {
        instance.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}
Quill.register(ImageFormat, true);

const Size = Quill.import('attributors/style/size');
Size.whitelist = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '22px'];
Quill.register(Size, true);

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

  private colors = [
    '#000000',
    '#e60000',
    '#ff9900',
    '#ffff00',
    '#008a00',
    '#0066cc',
    '#9933ff',
    '#ffffff',
    '#facccc',
    '#ffebcc',
    '#ffffcc',
    '#cce8cc',
    '#cce0f5',
    '#ebd6ff',
    '#bbbbbb',
    '#f06666',
    '#ffc266',
    '#ffff66',
    '#66b966',
    '#66a3e0',
    '#c285ff',
    '#888888',
    '#a10000',
    '#b26b00',
    '#b2b200',
    '#006100',
    '#0047b2',
    '#6b24b2',
    '#444444',
    '#5c0000',
    '#663d00',
    '#666600',
    '#003700',
    '#002966',
    '#3d1466',
    'custom-color'
  ];

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
          [{size: Size.whitelist}],
          [{list: 'ordered' }, {list: 'bullet' }],
          [{script: 'sub' }, {script: 'super' }],
          [{indent: '-1' }, {indent: '+1' }],
          [{direction: 'rtl' }],
          [{header: [1, 2, 3, 4, 5, 6, false]}],
          [{color: this.colors}, {background: this.colors}],
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
    tooltip.textbox.setAttribute('data-color', 'Hex/RGB/RGBA');
    tooltip.textbox.setAttribute('data-background', 'Hex/RGB/RGBA');

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

    const colorHandler = (type) => {
      return () => {
        const originalSave = tooltip.save;
        tooltip.save = () => {
          const value = tooltip.textbox.value;
          if (value) {
            quill.format(type, value);
          }
          tooltip.save = originalSave;
        };
        tooltip.edit(type);
      };
    };

    quill.format('size', '14px');
    quill.getModule('toolbar').addHandler('image', imageHandler);
    quill.getModule('toolbar').addHandler('color', colorHandler('color'));
    quill.getModule('toolbar').addHandler('background', colorHandler('background'));
  }
}
