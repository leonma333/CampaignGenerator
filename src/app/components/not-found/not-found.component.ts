import { Component } from '@angular/core';

@Component({
  selector: 'app-notfound',
  styleUrls: ['./not-found.component.scss'],
  template: `
    <h1>404 Not Found</h1>
    <p>Go to <a [routerLink]="'/'">home page</a> and start explore ~</p>
  `
})
export class NotFoundComponent {
  constructor() { }
}
