import { Injectable, ViewChild } from '@angular/core';

import { Query, DataManager, Predicate } from '@syncfusion/ej2-data';

import { AppComponent } from '../../app.component';

@Injectable()
export class FilterService {
    public predicate: Predicate;
    public predicateEnd: Predicate;
    public predicateStart: Predicate;

    constructor(public app: AppComponent) {}

    /** Gets the minimum and maximum amount from the datasource */
    public minMaxAmount(start: Date, end: Date): Object {
        let predicateStart: Predicate = new Predicate('DateTime', 'greaterthanorequal', start);
        let predicateEnd: Predicate = new Predicate('DateTime', 'lessthanorequal', end);
        let minAmount: any = new DataManager(<JSON[]>this.app.dataSource).executeLocal((new Query()
            .where((predicateStart.and(predicateEnd))))
            .requiresCount().aggregate('min', 'Amount'));
        let maxAmount: any = new DataManager(<JSON[]>this.app.dataSource).executeLocal((new Query()
            .where((predicateStart.and(predicateEnd))))
            .requiresCount().aggregate('max', 'Amount'));
        return {
            minValue: minAmount.aggregates['Amount - min'],
            maxValue: maxAmount.aggregates['Amount - max']
        };
    }
}