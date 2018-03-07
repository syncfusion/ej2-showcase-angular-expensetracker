import { Injectable, ViewChild } from '@angular/core';

import { extend, Internationalization } from '@syncfusion/ej2-base';
import { Predicate } from '@syncfusion/ej2-data';

import { expenseData } from '../common/common.data';

@Injectable()
export class CommonService {
  public predicateStart: Predicate;
  public predicateEnd: Predicate;
  public predicate: Predicate;
  public intl: Internationalization = new Internationalization();

  constructor() {}

  public getPredicate(start: Date, end: Date): Predicate {
    this.predicateStart = new Predicate('DateTime', 'greaterthanorequal', start);
    this.predicateEnd = new Predicate('DateTime', 'lessthanorequal', end);
    this.predicate = this.predicateStart.and(this.predicateEnd);
    return this.predicate;
  }

  public addRootClass(cls: string): void {
    let ele: HTMLElement = document.body;
    ele.classList.add(cls);
  }

  public removeRootClass(): void {
    let ele: HTMLElement = document.body;
    ele.classList.remove('dashboard-page');
    ele.classList.remove('expense-page');
    ele.classList.remove('about-page');
  }

  public objectAssign(e: any): object[] {
    let result: Object[] = [];
    let obj: any;
    obj = extend(obj, e.result, {}, true);
    for (let data: number = 0; data < Object.keys(e.result).length; data++) {
        result.push(obj[data]);
    }
    return result;
  }

    public getDate(value: Date): string {
        return this.intl.formatDate(value, { skeleton: 'yMd', type: 'date' });
    }

    public getCurrencyVal(value: number): string {
        return this.intl.formatNumber(value, { format: 'C0' });
    }

    public getNumberVal(value: number): string {
        return this.intl.getNumberFormat({ skeleton: 'C0', currency: 'USD' })(value);
    }
}