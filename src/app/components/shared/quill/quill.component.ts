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

const Parchment = Quill.import('parchment');
Quill.register(new Parchment.Attributor.Style('padding', 'padding', {scope: Parchment.Scope.INLINE}), true);
Quill.register(new Parchment.Attributor.Style('spacing', 'line-height', {scope: Parchment.Scope.BLOCK}), true);

const BlockEmbed = Quill.import('blots/block/embed');
class DividerBlot extends BlockEmbed {}
(DividerBlot as any).blotName = 'divider';
(DividerBlot as any).tagName = 'hr';
Quill.register(DividerBlot);

const Inline = Quill.import('blots/inline');
class DynamicBlot extends Inline {
  static create(key) {
    const node = super.create();
    if (typeof key === 'object') {
      node.setAttribute('key', key.key);
      node.setAttribute('style', key.style);
    } else {
      node.setAttribute('key', key);
      node.setAttribute('style', 'border-style:dotted;border-width:1px;');
      node.innerText = `\$\{${key}\}`;
    }
    return node;
  }

  static formats(node) {
    const format = {} as any;
    if (node.hasAttribute('key')) {
      format.key = node.getAttribute('key');
    }
    if (node.hasAttribute('style')) {
      format.style = node.getAttribute('style');
    }
    return format;
  }
}
(DynamicBlot as any).blotName = 'dynamic-content';
(DynamicBlot as any).tagName = 'dynamic';
Quill.register(DynamicBlot);

@Component({
  selector: 'app-quill',
  templateUrl: './quill.component.html',
  styleUrls: ['./quill.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuillComponent),
      multi: true
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
          [{size: Size.whitelist}, {spacing: ['0.5', '1', '1.5', '2', '2.5', '3']}],
          [{list: 'ordered' }, {list: 'bullet' }],
          [{script: 'sub' }, {script: 'super' }],
          [{indent: '-1' }, {indent: '+1' }],
          [{direction: 'rtl' }],
          [{header: [1, 2, 3, 4, 5, 6, false]}],
          [{color: this.colors}, {background: this.colors}],
          [{font: []}],
          [{align: []}],
          ['clean', 'dynamic-content'],
          ['emoji', 'divider'],
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
    tooltip.textbox.setAttribute('data-dynamic-content', 'Dynamic field key');

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
      return (selection) => {
        if (selection === 'custom-color') {
          const originalSave = tooltip.save;
          tooltip.save = () => {
            const value = tooltip.textbox.value;
            if (value) {
              quill.format(type, value);
            }
            tooltip.save = originalSave;
          };
          tooltip.edit(type);
        } else {
          quill.format(type, selection);
        }
      };
    };

    const spacingHandler = (value) => {
      const range = quill.getSelection();
      quill.format('spacing', value);
      quill.formatText(range.index, range.length, 'padding', `${value / 2}em 0`);
    };

    const dividerHandler = () => {
      const range = quill.getSelection(true);
      quill.insertText(range.index, '\n', Quill.sources.USER);
      quill.insertEmbed(range.index + 1, 'divider', true, Quill.sources.USER);
      quill.setSelection(range.index + 2, Quill.sources.SILENT);
    };

    const dynamicContentHandler = () => {
      const originalSave = tooltip.save;
      tooltip.save = () => {
        const range = quill.getSelection(true);
        const value = tooltip.textbox.value;
        if (value) {
          quill.insertEmbed(range.index, 'dynamic-content', value, 'user');
        }
        tooltip.save = originalSave;
      };
      tooltip.edit('dynamic-content');
    };

    document.querySelector('.ql-divider').innerHTML =
      '<svg viewBox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="9" y2="9"></line></svg>';

    document.querySelector('.ql-dynamic-content').innerHTML =
      '<svg viewBox="0 0 18 18"><line class="ql-stroke" x1="3.4" x2="9.4" y1="15.6" y2="9.6"/>' +
      '<line class="ql-stroke" x1="11" x2="12" y1="8" y2="7"/>' +
      '<line class="ql-stroke ql-thin" x1="10" x2="8.7" y1="6" y2="4.2"/>' +
      '<line class="ql-stroke ql-thin" x1="11.7" x2="11.6" y1="5.1" y2="3"/>' +
      '<line class="ql-stroke ql-thin" x1="13.6" x2="15.1" y1="5.7" y2="4.1"/>' +
      '<line class="ql-stroke ql-thin" x1="14" x2="16.1" y1="7.5" y2="7.5"/>' +
      '<line class="ql-stroke ql-thin" x1="13" x2="14.8" y1="9" y2="10.2"/></svg>';

    quill.format('size', '14px');
    quill.getModule('toolbar').addHandler('image', imageHandler);
    quill.getModule('toolbar').addHandler('spacing', spacingHandler);
    quill.getModule('toolbar').addHandler('divider', dividerHandler);
    quill.getModule('toolbar').addHandler('color', colorHandler('color'));
    quill.getModule('toolbar').addHandler('background', colorHandler('background'));
    quill.getModule('toolbar').addHandler('dynamic-content', dynamicContentHandler);
  }
}
