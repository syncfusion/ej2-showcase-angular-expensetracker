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
        this.listTitle = 'List of EJ2 components used in this sample';
        this.description = 'This expense tracker demo application showcases using several Essential JS 2 '
            + 'components together in a real-world application scenario. You can further explore the source '
            + 'code of this application and use it as a reference for integrating Essential JS 2 components '
            + 'into your applications.';

        this.controlList = [
            { 'control': 'Button', 'link': 'http://ej2.syncfusion.com/angular/documentation/button/getting-started/' },
            { 'control': 'Chart', 'link': 'http://ej2.syncfusion.com/angular/documentation/chart/getting-started/' },
            { 'control': 'CheckBox', 'link': 'http://ej2.syncfusion.com/angular/documentation/check-box/getting-started/' },
            { 'control': 'DatePicker', 'link': 'http://ej2.syncfusion.com/angular/documentation/datepicker/getting-started/' },
            { 'control': 'DateRangePicker', 'link': 'http://ej2.syncfusion.com/angular/documentation/daterangepicker/getting-started/' },
            { 'control': 'Dialog', 'link': 'http://ej2.syncfusion.com/angular/documentation/dialog/getting-started/' },
            { 'control': 'DropDownList', 'link': 'http://ej2.syncfusion.com/angular/documentation/drop-down-list/getting-started/' },
            { 'control': 'Grid', 'link': 'http://ej2.syncfusion.com/angular/documentation/grid/getting-started/' },
            { 'control': 'MultiSelect', 'link': 'http://ej2.syncfusion.com/angular/documentation/multi-select/getting-started/' },
            { 'control': 'NumericTextBox', 'link': 'http://ej2.syncfusion.com/angular/documentation/numerictextbox/getting-started/' },
            { 'control': 'RadioButton' , 'link': 'http://ej2.syncfusion.com/angular/documentation/radio-button/getting-started/'},
            { 'control': 'TextBoxes', 'link': 'http://ej2.syncfusion.com/angular/documentation/textbox/getting-started/' },
            { 'control': 'TimePicker', 'link': 'http://ej2.syncfusion.com/angular/documentation/timepicker/getting-started/' }
        ];
    }

    public ngOnInit(): void {
        this.cards.updateCardValues();
        this.menu.removeToggleClass();
        this.menu.disableOverlay();
    }
}