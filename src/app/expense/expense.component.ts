import { Component, ViewEncapsulation, ViewChild, OnInit, HostListener } from '@angular/core';

import { Browser } from '@syncfusion/ej2-base';

import { MenuComponent } from '../menu/menu.component';
import { FilterComponent } from './filter/filter.component';
import { DialogsComponent } from './dialogs/dialogs.component';
import { ContentComponent } from './content/content.component';
import { CardsComponent } from '../dashboard/cards/cards.component';

import { CommonService } from '../common/common.service';

@Component({
    templateUrl: 'expense.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [CommonService, CardsComponent]
})
export class ExpenseComponent implements OnInit {
    @ViewChild('filterSection') filterObj: FilterComponent;
    @ViewChild('dialogSection') dialogObj: DialogsComponent;
    @ViewChild('contentSection') contentObj: ContentComponent;

    constructor(
        public common: CommonService,
        public cards: CardsComponent,
        public menu: MenuComponent
    ) {
        this.common.removeRootClass();
        this.common.addRootClass('expense-page');
    }

    public ngOnInit(): void {
        /** On initial load, update the sidebar selections and overlay */
        this.menu.removeToggleClass();
        this.menu.disableOverlay();
        this.cards.updateCardValues();
    }

    public ngAfterViewInit(): void {
        this.contentObj.filterCompObj = this.filterObj;
        this.filterObj.cntCompObj = this.contentObj;
        this.contentObj.dlgCompObj = this.dialogObj;
        this.dialogObj.cntCompObj = this.contentObj;
    }
}