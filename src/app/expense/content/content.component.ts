import { Component, ViewEncapsulation, OnInit, ElementRef, ViewChild } from '@angular/core';

import { KeyboardEventArgs } from '@syncfusion/ej2-base';
import { Query, DataManager, Predicate } from '@syncfusion/ej2-data';
import { Input } from '@syncfusion/ej2-inputs';
import { GridComponent, RowSelectEventArgs, RowDeselectEventArgs, CheckBoxChangeEventArgs,
    PageService, EditService, CommandColumnService, ToolbarService, ContextMenuService,
    ResizeService } from '@syncfusion/ej2-angular-grids';

import { AppComponent } from '../../app.component';
import { MenuComponent } from '../../menu/menu.component';
import { DialogsComponent } from '../dialogs/dialogs.component';

import { expenseData, categoryIncomeData, categoryExpenseData } from '../../common/common.data';

@Component({
    selector: 'content-section',
    templateUrl: 'content.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [DialogsComponent, AppComponent, PageService, EditService, CommandColumnService, ToolbarService, ContextMenuService, ResizeService],
})
export class ContentComponent implements OnInit {
    @ViewChild('transactGrid') grid: GridComponent;

    public query: Query;
    public dlgCompObj: any;
    public filterCompObj: any;
    public predicate: Predicate;
    public dataSource: Object[];
    public pageSettings: Object;
    public editSettings: Object;
    public validateRule: Object;
    public toolbarValue: Object[];
    public predicateEnd: Predicate;
    public transactionTitle: string;
    public predicateStart: Predicate;
    public searchInput: HTMLInputElement;
    public clearIcon: HTMLElement;

    constructor(
        public app: AppComponent,
        public eleRef: ElementRef,
        public menu: MenuComponent) {}

    public ngOnInit(): void {
        this.transactionTitle = 'All Transactions';

        /** Configurations for the Expense Grid component */
        this.predicateStart = new Predicate('DateTime', 'greaterthanorequal', this.app.startDate);
        this.predicateEnd = new Predicate('DateTime', 'lessthanorequal', this.app.endDate);
        this.predicate = this.predicateStart.and(this.predicateEnd);
        this.toolbarValue = ['Edit', 'Delete'];
        this.query = new Query().where(this.predicate).sortByDesc('DateTime');
        this.pageSettings = { pageSize: 11 };
        this.validateRule = { required: true };
        this.editSettings = { allowEditing: true };
    }

    public ngAfterViewInit(): void {
        this.searchInput = this.eleRef.nativeElement.querySelector('#txt');
        Input.createInput({
            element: this.searchInput,
            properties: {
                showClearButton: true
            }
        });
        this.clearIcon = this.eleRef.nativeElement.querySelector('.e-clear-icon');
        this.clearIcon.onmousedown = () => {
            this.searchInput.value = '';
        };
    }

    public onGridCreated(): void {
        /** Edit and Delete toolbar items customization on the grid's created event */
        let ele: any = this.eleRef.nativeElement.querySelector('#grid_edit');
        let el: any = this.eleRef.nativeElement.querySelector('#grid_delete');
        if (ele) {
            ele.addEventListener('click', this.showEditTransactDialog.bind(this));
        }
        if (el) {
            el.addEventListener('click', this.showDeleteDialog.bind(this));
        }
    }

    public onGridCellSaved(args: any): void {
        new DataManager(<JSON[]> this.app.dataSource).update('UniqueId', args.rowData);
    }

    public onGridRowSelected(args: RowSelectEventArgs): void {
        this.handleToolbarVisibility();
    }
    public onGridRowDeselected(args: RowDeselectEventArgs): void {
        this.handleToolbarVisibility();
    }

    public showAddTransactDialog(): void {
        this.dlgCompObj.showAddDialog();
    }

    public showDeleteDialog(): void {
        this.dlgCompObj.showAlertDialog();
    }

    public showEditTransactDialog(): void {
        this.dlgCompObj.showEditDialog();
        setTimeout(() => {
            this.grid.toolbarModule.toolbar.enableItems(document.getElementById('grid_delete').parentElement, true);
        }, 0);
    }

    public showFilterNavigation(): void {
        this.menu.toggleFilterMenu();
    }

    /** Performs search operation when press Enter key */
    public onInputKeyUpSearch(args: KeyboardEventArgs): void {
        if (args.keyCode === 13) {
            this.grid.search(this.searchInput.value);
        }
    }

    /** Disables edit toolbar item in the Expense Grid on the initial load */
    public onGridActionComplete(e: any): void {
        setTimeout(() => {
            this.grid.toolbarModule.toolbar.enableItems(document.getElementById('grid_edit').parentElement, false);
        }, 0);
    }

    /** Prevents the edit operation of Grid, since we handled the custom dialog for the edit operation */
    public onEditBegin(e: any): void {
        if (e.requestType === 'beginEdit') {
            e.cancel = true;
        }
    }

    /** Performs search operation in the Expense Grid */
    public onSearchClicked(): void {
        this.grid.search(this.searchInput.value);
    }

    /** Based on the selected rows from the Grid, updates the visibility of the toolbar items (Edit, Delete) */
    public handleToolbarVisibility(): void {
        if (this.grid.getSelectedRowIndexes().length > 1) {
            this.grid.toolbarModule.toolbar.enableItems(document.getElementById('grid_edit').parentElement, false);
            this.grid.toolbarModule.toolbar.enableItems(document.getElementById('grid_delete').parentElement, true);
        } else if (this.grid.getSelectedRowIndexes().length === 0) {
            this.grid.toolbarModule.toolbar.enableItems(document.getElementById('grid_edit').parentElement, false);
            this.grid.toolbarModule.toolbar.enableItems(document.getElementById('grid_delete').parentElement, false);
        } else if (this.grid.getSelectedRowIndexes().length === 1) {
            this.grid.toolbarModule.toolbar.enableItems(document.getElementById('grid_edit').parentElement, true);
            this.grid.toolbarModule.toolbar.enableItems(document.getElementById('grid_delete').parentElement, true);
        }
    }
}