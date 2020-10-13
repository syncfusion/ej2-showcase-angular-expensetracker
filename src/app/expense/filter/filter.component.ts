import { Component, ViewEncapsulation, ViewChild, OnInit, ChangeDetectorRef  } from '@angular/core';

import { Query, Predicate } from '@syncfusion/ej2-data';
import { isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { CheckBoxComponent, ChangeEventArgs } from '@syncfusion/ej2-angular-buttons';
import { DateRangePickerComponent, RangeEventArgs } from '@syncfusion/ej2-angular-calendars';
import { MultiSelectComponent, SelectEventArgs, RemoveEventArgs } from '@syncfusion/ej2-angular-dropdowns';

import { AppComponent } from '../../app.component';

import { FilterService } from './filter.service';

@Component({
    selector: 'filter-section',
    templateUrl: 'filter.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [FilterService, AppComponent]
})
export class FilterComponent implements OnInit {
    @ViewChild('filterCash') cashFilter: CheckBoxComponent;
    @ViewChild('filterDebit') debitFilter: CheckBoxComponent;
    @ViewChild('filterCredit') creditFilter: CheckBoxComponent;
    @ViewChild('filterIncome') incomeFilter: CheckBoxComponent;
    @ViewChild('filterExpense') expenseFilter: CheckBoxComponent;
    @ViewChild('filterMinAmount') minAmtFilter: CheckBoxComponent;
    @ViewChild('filterMaxAmount') maxAmtFilter: CheckBoxComponent;
    @ViewChild('filterMultiSelect') multiSelectFilter: MultiSelectComponent;
    @ViewChild('filterDateRange') dateRangeFilter: DateRangePickerComponent;

    public cntCompObj: any;
    public minValue: number;
    public maxValue: number;
    public predicate: Predicate;
    public predicateEnd: Predicate;
    public tempData: IExpenseData[];
    public filterCategory: string[];
    public cashPredicate: Predicate;
    public predicateStart: Predicate;
    public debitPredicate: Predicate;
    public minAmtPredicate: Predicate;
    public maxAmtPredicate: Predicate;
    public incomePredicate: Predicate;
    public creditPredicate: Predicate;
    public expensePredicate: Predicate;
    public categoryPredicate: Predicate;
    public categoryPredicates: Predicate;

    constructor(
        public app: AppComponent,
        public filter: FilterService,
        private chgRef: ChangeDetectorRef
    ) {
        this.filterCategory = [];
    }

    public ngOnInit(): void {
        this.minValue = 0;
        this.maxValue = 0;
        this.tempData = <IExpenseData[]>this.app.dataSource;
        this.getCategory(this.app.startDate, this.app.endDate);
    }

    /** Gets the available category in-between the start and end date, for category filter dropdown */
    public getCategory(start: Date, end: Date): void {
        this.filterCategory = [];
        this.tempData.forEach((item: any) => {
            if (start.valueOf() <= item.DateTime.valueOf() && end.valueOf() >= item.DateTime.valueOf()) {
                if (this.filterCategory.indexOf(item.Category) < 0) {
                    this.filterCategory.push(item.Category);
                }
            }
        });
    }

    public numericTextBoxCreated(): void {
        let val: IMinMax = <IMinMax> this.filter.minMaxAmount(this.dateRangeFilter.startDate, this.dateRangeFilter.endDate);
        this.minValue = val.minValue;
        this.maxValue = val.maxValue;
        this.chgRef.detectChanges();
    }

    /** Updates the Grid datasource based on the modified date range values */
    public dateRangeChanged(args: RangeEventArgs): void {
        this.app.startDate = args.startDate;
        this.app.endDate = args.endDate;
        this.predicateStart = new Predicate('DateTime', 'greaterthanorequal', this.app.startDate);
        this.predicateEnd = new Predicate('DateTime', 'lessthanorequal', this.app.endDate);
        this.predicate = this.predicateStart.and(this.predicateEnd);
        this.updateGrid(this.app.startDate, this.app.endDate, 'dateChange');
    }

    /** Filters the datasource based on amount */
    public amountChanged(): void {
        this.updateGrid(this.dateRangeFilter.startDate, this.dateRangeFilter.endDate, '');
    }

    /** Filters the datasource based on Cashflow and Payment modes */
    public checkBoxStateChanged(args: ChangeEventArgs): void {
        this.updateGrid(this.dateRangeFilter.startDate, this.dateRangeFilter.endDate, '');
    }

    /** Filters the datasource when category selected or deselected, from Multiselect component */
    public categorySelected(args: SelectEventArgs): void {
        setTimeout(() => {
            this.updateGrid(this.dateRangeFilter.startDate, this.dateRangeFilter.endDate, '');
        }, 10);
    }
    public categoryRemoved(args: RemoveEventArgs): void {
        this.updateGrid(this.dateRangeFilter.startDate, this.dateRangeFilter.endDate, '');
    }

    /** Updates the Grid based on the filtered data source */
    public updateGrid(start: Date, end: Date, updater: string): void {
        if (end instanceof Date) {
            end.setHours(23);
            end.setMinutes(59);
        }
        this.predicateStart = new Predicate('DateTime', 'greaterthanorequal', start);
        this.predicateEnd = new Predicate('DateTime', 'lessthanorequal', end);
        this.predicate = this.predicateStart.and(this.predicateEnd);
        let val: IMinMax = <IMinMax> this.filter.minMaxAmount(start, end);
        this.minValue = val.minValue;
        this.maxValue = val.maxValue;
        this.minAmtPredicate = new Predicate('Amount', 'greaterthanorequal', this.minAmtFilter.value);
        this.maxAmtPredicate = new Predicate('Amount', 'lessthanorequal', this.maxAmtFilter.value);
        this.predicate = this.predicate.and(this.minAmtPredicate).and(this.maxAmtPredicate);
        if (this.incomeFilter.checked || this.expenseFilter.checked) {
            if (this.incomeFilter.checked) {
                this.incomePredicate = new Predicate('TransactionType', 'equal', 'Income');
            }
            if (this.expenseFilter.checked) {
                this.expensePredicate = new Predicate('TransactionType', 'equal', 'Expense');
            }
            if (this.expenseFilter.checked && this.incomeFilter.checked) {
                this.incomePredicate = this.incomePredicate.or(this.expensePredicate);
                this.predicate = this.predicate.and(this.incomePredicate);
            } else if (this.incomeFilter.checked) {
                this.predicate = this.predicate.and(this.incomePredicate);
            } else if (this.expenseFilter.checked) {
                this.predicate = this.predicate.and(this.expensePredicate);
            }
        }
        if (this.cashFilter.checked || this.debitFilter.checked || this.creditFilter.checked) {
            if (this.cashFilter.checked) {
                this.cashPredicate = new Predicate('PaymentMode', 'equal', 'Cash');
            }
            if (this.creditFilter.checked) {
                this.creditPredicate = new Predicate('PaymentMode', 'equal', 'Credit Card');
            }
            if (this.debitFilter.checked) {
                this.debitPredicate = new Predicate('PaymentMode', 'equal', 'Debit Card');
            }
            if (this.cashFilter.checked && this.creditFilter.checked && this.debitFilter.checked) {
                this.incomePredicate = this.creditPredicate.or(this.debitPredicate).or(this.cashPredicate);
                this.predicate = this.predicate.and(this.incomePredicate);
            } else if (this.cashFilter.checked && this.creditFilter.checked) {
                this.incomePredicate = this.cashPredicate.or(this.creditPredicate);
                this.predicate = this.predicate.and(this.incomePredicate);
            } else if (this.cashFilter.checked && this.debitFilter.checked) {
                this.incomePredicate = this.cashPredicate.or(this.debitPredicate);
                this.predicate = this.predicate.and(this.incomePredicate);
            } else if (this.creditFilter.checked && this.debitFilter.checked) {
                this.incomePredicate = this.creditPredicate.or(this.debitPredicate);
                this.predicate = this.predicate.and(this.incomePredicate);
            } else if (this.cashFilter.checked) {
                this.predicate = this.predicate.and(this.cashPredicate);
            } else if (this.debitFilter.checked) {
                this.predicate = this.predicate.and(this.debitPredicate);
            } else if (this.creditFilter.checked) {
                this.predicate = this.predicate.and(this.creditPredicate);
            }
        }
        if (!isNOU(this.multiSelectFilter.value) && this.multiSelectFilter.value.length > 0) {
            let list: string[] = <string[]> this.multiSelectFilter.value;
            for (let i: number = 0; i < list.length; i++) {
                this.categoryPredicate = new Predicate('Category', 'equal', list[i]);
                if (i === 0) {
                    this.categoryPredicates = this.categoryPredicate;
                } else {
                    this.categoryPredicates = this.categoryPredicates.or(this.categoryPredicate);
                }
            }
            this.predicate = this.predicate.and(this.categoryPredicates);
        }
        this.cntCompObj.grid.setProperties({
            dataSource: this.app.dataSource,
            query: new Query().where(this.predicate).sortByDesc('DateTime')
        });
        this.cntCompObj.grid.refresh();
        this.getCategory(start, end);
        this.multiSelectFilter.dataSource = this.filterCategory;
        this.multiSelectFilter.dataBind();
    }
}

export interface IMinMax {
    minValue: number;
    maxValue: number;
}

export interface IExpenseData {
    Amount: number;
    Category: string;
    DateTime: Date;
    Description: string;
    PaymentMode: string;
    TransactionType: string;
    UniqueId: string;
}