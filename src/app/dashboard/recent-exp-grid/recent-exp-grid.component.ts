import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { Query, Predicate } from '@syncfusion/ej2-data';

import { AppComponent } from '../../app.component';

@Component({
    selector: 'recent-exp-grid',
    templateUrl: 'recent-exp-grid.component.html',
    encapsulation: ViewEncapsulation.None
})
export class RecentExpGridComponent implements OnInit {
    public query: Query;
    public gridToolbar: Object[];
    public predicate: Predicate;
    public predicateEnd: Predicate;
    public predicateStart: Predicate;

    constructor(public app: AppComponent) {}

    public ngOnInit(): void {
        this.predicateStart = new Predicate('DateTime', 'greaterthanorequal', this.app.startDate);
        this.predicateEnd = new Predicate('DateTime', 'lessthanorequal', this.app.endDate);
        this.predicate = this.predicateStart.and(this.predicateEnd);

        /** Query to takes last 5 lows to show the recent records only */
        this.query = new Query().where(this.predicate).sortByDesc('DateTime').take(5);
        this.gridToolbar = [{ text: 'Recent Transactions' }];
    }
}