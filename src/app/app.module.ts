import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { APP_BASE_HREF, HashLocationStrategy, Location, LocationStrategy} from '@angular/common';

import { GridModule, PagerModule } from '@syncfusion/ej2-angular-grids';
import { NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { CheckBoxAllModule, RadioButtonAllModule } from '@syncfusion/ej2-angular-buttons';
import { ChartAllModule, AccumulationChartAllModule } from '@syncfusion/ej2-angular-charts';
import { MultiSelectAllModule, DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { DialogAllModule, TooltipAllModule } from '@syncfusion/ej2-angular-popups';
import { DateRangePickerModule, DateRangePickerAllModule, DatePickerAllModule, TimePickerAllModule } from '@syncfusion/ej2-angular-calendars';

import { routing } from './app.router';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { AboutComponent } from './about/about.component';
import { ExpenseComponent } from './expense/expense.component';
import { CardsComponent } from './dashboard/cards/cards.component';
import { FilterComponent } from './expense/filter/filter.component';
import { DashBoardComponent } from './dashboard/dashboard.component';
import { ContentComponent } from './expense/content/content.component';
import { DialogsComponent } from './expense/dialogs/dialogs.component';
import { PieChartComponent } from './dashboard/pie-chart/pie-chart.component';
import { LineChartComponent } from './dashboard/line-chart/line-chart.component';
import { ColumnChartComponent } from './dashboard/column-chart/column-chart.component';
import { RecentExpGridComponent } from './dashboard/recent-exp-grid/recent-exp-grid.component';

import { CommonService } from './common/common.service';
import { DashBoardService } from './dashboard/dashboard.service';

@NgModule({
    imports: [
        routing,
        GridModule,
        PagerModule,
        BrowserModule,
        ChartAllModule,
        DialogAllModule,
        CheckBoxAllModule,
        DatePickerAllModule,
        TimePickerAllModule,
        MultiSelectAllModule,
        RadioButtonAllModule,
        DateRangePickerModule,
        DropDownListAllModule,
        NumericTextBoxAllModule,
        DateRangePickerAllModule,
        AccumulationChartAllModule
    ],
    declarations: [
        AppComponent,
        MenuComponent,
        CardsComponent,
        AboutComponent,
        FilterComponent,
        ExpenseComponent,
        ContentComponent,
        DialogsComponent,
        PieChartComponent,
        DashBoardComponent,
        LineChartComponent,
        ColumnChartComponent,
        RecentExpGridComponent,
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        Location,
        CommonService,
        DashBoardService,
        ContentComponent,
        {provide: APP_BASE_HREF, useValue : '/' },
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ]
})
export class AppModule {
    private location: Location;
    constructor(location: Location) {
        this.location = location;
    }
 }