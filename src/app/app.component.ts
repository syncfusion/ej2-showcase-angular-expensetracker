import { Component, Directive, HostListener } from '@angular/core';

import { expenseData, startDate, endDate } from './common/common.data';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public dataSource: Object[];
  public startDate: Date;
  public endDate: Date;

  constructor() {
    this.startDate = startDate;
    this.endDate = endDate;
    this.dataSource = expenseData;
    this.handleResize();
  }

  public handleResize(): void {
    if (document.documentElement.offsetWidth > 1400) {
      document.body.style.minHeight = 'auto';
      document.body.style.minHeight = document.documentElement.offsetHeight + 'px';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    /** Document height alignment corrections for high resoultion screens */
    this.handleResize();
  }
}