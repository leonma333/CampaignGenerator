import { Component, Input, Output, EventEmitter } from '@angular/core';

import { NgbModal, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { faPlus, faPen, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';

import { Campaign } from '../../models/campaign';
import { ModalConfirmComponent } from '../shared/modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-dashboard-preview',
  templateUrl: './dashboard-preview.component.html',
  styleUrls: ['./dashboard-preview.component.scss']
})
export class DashboardPreviewComponent {
  @Input() campaign: Campaign;
  @Output() deleteId: EventEmitter<string> = new EventEmitter();

  faPlus = faPlus;
  faPen = faPen;
  faTrash = faTrash;
  faSearch = faSearch;

  constructor(public dateFormatter: NgbDateParserFormatter, private modalService: NgbModal) { }

  delete(): void {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    modalRef.componentInstance.title = 'Campaign deletion';
    modalRef.componentInstance.question = 'Are you sure you want to delete this campaign?';
    modalRef.componentInstance.note = 'All information associated with "' + this.campaign.name + '" will be permanently deleted.';
    modalRef.componentInstance.irreversible = true;
    modalRef.result.then(result => {
      if (result) {
        this.deleteId.emit(this.campaign.id);
      }
    });
  }

}
