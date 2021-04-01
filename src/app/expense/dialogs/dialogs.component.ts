import { Component, ViewEncapsulation, ViewChild, OnInit, ElementRef } from '@angular/core';

import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { NumericTextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { Query, DataManager, Predicate } from '@syncfusion/ej2-data';
import { DropDownListComponent  } from '@syncfusion/ej2-angular-dropdowns';
import { ChangeEventArgs, RadioButtonComponent } from '@syncfusion/ej2-angular-buttons';
import { DatePickerComponent, TimePickerComponent } from '@syncfusion/ej2-angular-calendars';

import { AppComponent } from '../../app.component';
import { CardsComponent } from '../../dashboard/cards/cards.component';

import { categoryIncomeData, categoryExpenseData } from '../../common/common.data';

@Component({
    selector: 'dialog-section',
    templateUrl: 'dialogs.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [ CardsComponent]
})
export class DialogsComponent implements OnInit {
    @ViewChild('dialog') dialog: DialogComponent;
    @ViewChild('confirmDialog') alertDialog: DialogComponent;
    @ViewChild('dlgAmount') dlgAmount: NumericTextBoxComponent;
    @ViewChild('dlgDropDown') dlgDropDown: DropDownListComponent;
    @ViewChild('dlgCashRadio') dlgCashRadio: RadioButtonComponent;
    @ViewChild('dlgDatePicker') dlgDatePicker: DatePickerComponent;
    @ViewChild('dlgTimePicker') dlgTimePicker: TimePickerComponent;
    @ViewChild('dlgDebitRadio') dlgDebitRadio: RadioButtonComponent;
    @ViewChild('dlgCreditRadio') dlgCreditRadio: RadioButtonComponent;
    @ViewChild('dlgIncomeRadio') dlgIncomeRadio: RadioButtonComponent;
    @ViewChild('dlgExpenseRadio') dlgExpenseRadio: RadioButtonComponent;

    public dateValue: Date;
    public cntCompObj: any;
    public isModal: boolean;
    public proxy: any = this;
    public predicate: Predicate;
    public dlgTarget: HTMLElement;
    public dropDownFields: Object;
    public predicateEnd: Predicate;
    public addDlgButtons: Object[];
    public editDlgButtons: Object[];
    public enableCloseIcon: boolean;
    public predicateStart: Predicate;
    public animationSettings: Object;
    public deleteDlgButtons: Object[];
    public enableCloseOnEscape: boolean;
    public categoryDataSource: Object[];
    public description: HTMLInputElement;

    constructor(public app: AppComponent, public eleRef: ElementRef, public cards: CardsComponent) {
        this.predicateStart = new Predicate('DateTime', 'greaterthanorequal', this.app.startDate);
        this.predicateEnd = new Predicate('DateTime', 'lessthanorequal', this.app.endDate);
        this.predicate = this.predicateStart.and(this.predicateEnd);
        this.isModal = true;
        this.dlgTarget = document.body;
        this.enableCloseIcon = true;
        this.enableCloseOnEscape = false;
        this.animationSettings = { effect: 'None' };

        /** Functionalities for the buttons of "Add Dialog" window */
        this.addDlgButtons = [{
            click: (() => {
                let newExpense: IExpenseData = {
                    'UniqueId': 'T' + ('' + (+new Date())).substring(5, 10),
                    'DateTime': new Date(this.dlgDatePicker.value.setHours(this.dlgTimePicker.value.getHours())),
                    'Category': <string> this.dlgDropDown.value,
                    'PaymentMode': (this.dlgCashRadio.checked && this.dlgCashRadio.label) ||
                        (this.dlgCreditRadio.checked && this.dlgCreditRadio.label) ||
                        (this.dlgDebitRadio.checked && this.dlgDebitRadio.label),
                    'TransactionType': (this.dlgIncomeRadio.checked && this.dlgIncomeRadio.label) ||
                        (this.dlgExpenseRadio.checked && this.dlgExpenseRadio.label),
                    'Description': this.description.value,
                    'Amount':  this.dlgAmount.value
                };
                new DataManager(<JSON[]>this.app.dataSource).insert(newExpense);
                new DataManager(<JSON[]>this.app.dataSource).update('UniqueId', {
                    UniqueId: newExpense.UniqueId,
                    'DateTime': (this.dlgDatePicker.value),
                    'Category': newExpense.Category,
                    'PaymentMode': newExpense.PaymentMode,
                    'TransactionType': newExpense.TransactionType,
                    'Description': newExpense.Description,
                    'Amount': newExpense.Amount
                });
                this.cntCompObj.grid.setProperties({
                    dataSource: this.app.dataSource,
                    query: new Query().where(this.predicate).sortByDesc('DateTime')
                });
                this.cntCompObj.grid.refresh();
                this.cards.updateCardValues();
                this.dialog.hide();
            }),
            buttonModel: { content: 'Add', cssClass: 'e-info e-add', isPrimary: true }
        }, {
            click: (() => {
                this.dialog.hide();
            }),
            buttonModel: { cssClass: 'e-outline e-cancel', content: 'Cancel' }
        }];

        /** Functionalities for the buttons of "Delete Dialog" window */
        this.deleteDlgButtons = [{
            click: (() => {
                let selectedRecords: Object[] = this.cntCompObj.grid.getSelectedRecords();
                for (let i: number = 0; i < selectedRecords.length; i++) {
                    new DataManager(<JSON[]>this.app.dataSource).remove('UniqueId', selectedRecords[i]);
                }
                this.cntCompObj.grid.refresh();
                this.cards.updateCardValues();
                this.alertDialog.hide();
            }), buttonModel: { content: 'Yes', cssClass: 'e-ok e-flat', isPrimary: true }
        }, {
            click: (() => {
                this.alertDialog.hide();
            }), buttonModel: { cssClass: 'e-no e-flat', content: 'No' }
        }];

        /** Functionalities for the buttons of "Edit Dialog" window */
        this.editDlgButtons = [{
            click: (() => {
                let editRecord: IExpenseData = <IExpenseData> this.cntCompObj.grid.getSelectedRecords()[0];
                let newExpense: IExpenseData  = {
                    'UniqueId': editRecord.UniqueId,
                    'DateTime': new Date(this.dlgDatePicker.value.setHours(this.dlgTimePicker.value.getHours())),
                    'Category': <string> this.dlgDropDown.value,
                    'PaymentMode': (this.dlgCashRadio.checked && this.dlgCashRadio.label) ||
                        (this.dlgCreditRadio.checked && this.dlgCreditRadio.label) ||
                        (this.dlgDebitRadio.checked && this.dlgDebitRadio.label),
                    'TransactionType': (this.dlgIncomeRadio.checked && this.dlgIncomeRadio.label) ||
                        (this.dlgExpenseRadio.checked && this.dlgExpenseRadio.label),
                    'Description': this.description.value,
                    'Amount': this.dlgAmount.value
                };
                new DataManager(<JSON[]>this.app.dataSource).update('UniqueId', newExpense);
                this.cntCompObj.grid.refresh();
                this.cards.updateCardValues();
                this.dialog.hide();
            }),
            buttonModel: { content: 'Save', cssClass: 'e-info e-add', isPrimary: true }
        }, {
            click: (() => {
                this.dialog.hide();
            }), buttonModel: { cssClass: 'e-outline e-cancel', content: 'Cancel' }
        }];
    }

    public ngOnInit(): void {
        /** Configurations for the Category selection dropdown */
        this.categoryDataSource = categoryExpenseData;
        this.dropDownFields = { text: 'Category', iconCss: 'Class', value: 'Category' };
    }

    public ngAfterViewInit(): void {
        this.description = this.eleRef.nativeElement.querySelector('#description');
    }

     /** Shows the "Edit Dialog" window with the corresponding selected row configuration */
    public showEditDialog(): void {
        this.dialog.header = 'Edit Transaction';
        this.dialog.buttons = this.editDlgButtons;
        this.dialog.dataBind();
        let selectedRecord: IExpenseData = <IExpenseData> this.cntCompObj.grid.getSelectedRecords()[0];
        if (!isNOU(selectedRecord)) {
            if (selectedRecord.TransactionType === 'Income') {
                this.dlgIncomeRadio.checked = true;
                this.dlgDropDown.dataSource = categoryIncomeData;
            } else if (selectedRecord.TransactionType === 'Expense') {
                this.dlgExpenseRadio.checked = true;
                this.dlgDropDown.dataSource = categoryExpenseData;
            }
            this.dlgDropDown.refresh();
            this.dlgDatePicker.value = selectedRecord.DateTime;
            this.dlgTimePicker.value = selectedRecord.DateTime;
            if (selectedRecord.PaymentMode === 'Credit Card') {
                this.dlgCreditRadio.checked = true;
            } else if (selectedRecord.PaymentMode === 'Debit Card') {
                this.dlgDebitRadio.checked = true;
            } else if (selectedRecord.PaymentMode === 'Cash') {
                this.dlgCashRadio.checked = true;
            }
            this.description.value = selectedRecord.Description;
            this.dlgDropDown.text = selectedRecord.Category;
            this.dlgAmount.value = selectedRecord.Amount;
            this.dialog.show();
        }
        this.dialog.show();
    }

    public showAlertDialog(): void {
        this.alertDialog.buttons = this.deleteDlgButtons;
        this.alertDialog.dataBind();
        this.alertDialog.show();
    }

    public alertDialogOpen(): void {
        this.proxy.alertDialog.dlgContainer.style.zIndex = '1000000';
    }

    /** Shows the "Add Dialog" window with the default configuration */
    public showAddDialog(): void {
        this.dialog.header = 'New Transaction';
        this.dialog.buttons = this.addDlgButtons;
        this.dialog.dataBind();
        this.dlgAmount.value = 0;
        this.description.value = '';
        this.dlgExpenseRadio.checked = true;
        this.dlgDropDown.dataSource = categoryExpenseData;
        this.dlgDropDown.dataBind();
        this.dlgCashRadio.checked = true;
        this.dialog.show();
    }

    /** Toggles the body scroll when the Dialog opens and close */
    public dialogOpen(): void {
        this.proxy.dialog.dlgContainer.style.zIndex = '1000000';
        document.body.style.overflowY = 'hidden';
    }
    public dlgClose(): void {
        document.body.style.overflowY = 'auto';
    }

    public dlgOverlayClicked(): void {
        this.proxy.alertDialog.hide();
        this.proxy.dialog.hide();
    }

    /** Update of the dropdown datasource based on the "Income" and "Expense" type */
    public dlgTransactTypeChanged(args: ChangeEventArgs): void {
        let transactValue: any = (<HTMLInputElement>args.event.target).value;
        if (transactValue === 'Expense') {
            this.dlgDropDown.dataSource = categoryExpenseData;
        } else {
            this.dlgDropDown.dataSource = categoryIncomeData;
        }
        this.dlgDropDown.dataBind();
    }
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