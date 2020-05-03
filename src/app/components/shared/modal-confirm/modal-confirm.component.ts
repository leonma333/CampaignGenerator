import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent implements OnInit {
  @Input() title: string;
  @Input() question: string;
  @Input() note: string;
  @Input() irreversible: boolean;

  constructor(public modal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

}
