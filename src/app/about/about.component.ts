import { LowerCasePipe } from '@angular/common';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { MenuComponent } from '../menu/menu.component';
import { CardsComponent } from '../dashboard/cards/cards.component';

import { CommonService } from '../common/common.service';

@Component({
    templateUrl: 'about.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [CommonService, CardsComponent]
})
export class AboutComponent implements OnInit {
    public title: string;
    public listTitle: string;
    public description: string;
    public controlList: Object[];

    /** Configurations for the About page */
    constructor(
        public common: CommonService,
        public cards: CardsComponent,
        public menu: MenuComponent
    ) {
        this.common.removeRootClass();
        this.common.addRootClass('about-page');
        this.title = 'About this sample';
        this.listTitle = 'List of components used in this sample';
        this.description = 'This expense tracker demo application showcases using several Essential JS 2 '
            + 'components together in a real-world application scenario. You can further explore the source '
            + 'code of this application and use it as a reference for integrating Essential JS 2 components '
            + 'into your applications.';

        this.controlList = [
            { 'control': 'Button' }, { 'control': 'Chart' }, { 'control': 'CheckBox' }, { 'control': 'DatePicker' },
            { 'control': 'DateRangePicker' }, { 'control': 'Dialog' }, { 'control': 'DropDownList' },
            { 'control': 'Grid' }, { 'control': 'MultiSelect' }, { 'control': 'NumericTextBox' },
            { 'control': 'RadioButton' }, { 'control': 'TextBoxes' }, { 'control': 'TimePicker' }
        ];
    }

    public ngOnInit(): void {
        this.cards.updateCardValues();
        this.menu.removeToggleClass();
        this.menu.disableOverlay();
    }
}