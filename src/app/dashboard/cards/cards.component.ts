import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { Internationalization } from '@syncfusion/ej2-base';
import { Query, DataManager, Predicate } from '@syncfusion/ej2-data';

import { AppComponent } from '../../app.component';

import { CommonService } from '../../common/common.service';

@Component({
    selector: 'cards',
    templateUrl: 'cards.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [CommonService]
})
export class CardsComponent implements OnInit {
    public predicate: Predicate;
    public predicateEnd: Predicate;
    public predicateStart: Predicate;
    public totalIncome: Number = 0;
    public totalExpense: Number = 0;
    public totalBalance: Number = 0;
    public totalTransactions: Number = 0;

    constructor(public common: CommonService, public app: AppComponent) {}

    public ngOnInit(): void {

        /** Updates each card values on the initial load */
        this.updateCardValues();
    }

    public updateCardValues(): void {
        let predicate: Predicate = this.common.getPredicate(this.app.startDate, this.app.endDate);
        let intl: Internationalization = new Internationalization();
        let nFormatter: Function = intl.getNumberFormat({ skeleton: 'C3', currency: 'USD' });
        let incomeRS: number = 0;
        let expenseRS: number = 0;
        let incomeD: any;
        let expenseD: any;

        /** Calulates total income and sets to the Income card */
        new DataManager(<JSON[]>this.app.dataSource).executeQuery((new Query()
        .where((predicate).and('TransactionType', 'equal', 'Income'))))
        .then((e: any) => {
            incomeD = this.common.objectAssign(e);
            for (let i: number = 0; i < incomeD.length; i++) {
                incomeRS += parseInt(incomeD[i].Amount, 0);
            }
            this.totalIncome = (incomeRS ? nFormatter(incomeRS) : nFormatter(0));
        });

        /** Calulates total expenses and sets to the Expenses card */
        new DataManager(<JSON[]>this.app.dataSource).executeQuery(new Query()
            .where((predicate).and('TransactionType', 'equal', 'Expense')))
            .then((e: any) => {
                expenseD = this.common.objectAssign(e);
                for (let i: number = 0; i < expenseD.length; i++) {
                    expenseRS += parseInt(expenseD[i].Amount, 0);
                }
                this.totalExpense = (expenseRS ? nFormatter(expenseRS) : nFormatter(0));
                document.getElementById('current-balance').textContent = '$ ' + nFormatter(incomeRS - expenseRS);

                /** Based on the Income and Expense, calulates the balance and sets to the Balance card */
                this.totalBalance = nFormatter(incomeRS - expenseRS);
            });

        /** Calulates total transactions and sets to the Transactions card */
        let transaction: any = new DataManager(<JSON[]>this.app.dataSource)
            .executeLocal((new Query().where(predicate)));
        this.totalTransactions = transaction.length;
    }
}