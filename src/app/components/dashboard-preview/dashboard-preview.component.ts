import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

import { Campaign } from '../../models/campaign';

@Component({
  selector: 'app-dashboard-preview',
  templateUrl: './dashboard-preview.component.html',
  styleUrls: ['./dashboard-preview.component.scss']
})
export class DashboardPreviewComponent implements OnInit {
  @Input() campaign: Campaign;
  @Output() deleteId: EventEmitter<string> = new EventEmitter();

  faPlus = faPlus;
  faPen = faPen;
  faTrash = faTrash;

  constructor() { }

  ngOnInit(): void {
  }

}
