import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';

import { Query, DataManager, Predicate } from '@syncfusion/ej2-data';
import { DateRangePickerComponent, RangeEventArgs } from '@syncfusion/ej2-angular-calendars';

import { AppComponent } from '../app.component';
import { MenuComponent } from '../menu/menu.component';
import { CardsComponent } from './cards/cards.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { ColumnChartComponent } from './column-chart/column-chart.component';
import { RecentExpGridComponent } from './recent-exp-grid/recent-exp-grid.component';

import { DashBoardService } from './dashboard.service';
import { CommonService } from '../common/common.service';

@Component({
    templateUrl: 'dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [DashBoardService, CommonService]
})
export class DashBoardComponent implements OnInit {
    @ViewChild('cards') cards: CardsComponent;
    @ViewChild('pieChart') pieChart: PieChartComponent;
    @ViewChild('lineChart') lineChart: LineChartComponent;
    @ViewChild('columnChart') columnChart: ColumnChartComponent;
    @ViewChild('recentGrid') recentGrid: RecentExpGridComponent;
    @ViewChild('dateRangePicker') dateRangePicker: DateRangePickerComponent;

    public predicate: Predicate;
    public datePresets: Object[];
    public lineChartData: Object[];
    public predicateEnd: Predicate;
    public predicateStart: Predicate;
    public colChartIncomeData: Object[];
    public colChartExpenseData: Object[];

    constructor(
        public app: AppComponent,
        public dashService: DashBoardService,
        public common: CommonService,
        public menu: MenuComponent
    ) {
        this.common.removeRootClass();
        this.common.addRootClass('dashboard-page');
    }

    public ngOnInit(): void {

        /** Configurations for the components in the DashBoard page */
        this.menu.removeToggleClass();
        this.menu.disableOverlay();
        this.datePresets = [
            { label: 'Last Month', start: new Date('10/1/2017'), end: new Date('10/31/2017') },
            { label: 'Last 3 Months', start: new Date('9/1/2017'), end: new Date('11/30/2017') },
            { label: 'All Time', start: new Date('6/1/2017'), end: new Date('11/30/2017') }
        ];
        this.predicateStart = new Predicate('DateTime', 'greaterthanorequal', this.app.startDate);
        this.predicateEnd = new Predicate('DateTime', 'lessthanorequal', this.app.endDate);
        this.predicate = this.predicateStart.and(this.predicateEnd);
        this.updateChartData();
    }

    public ngAfterViewInit(): void {
        this.columnChart.lineObj = this.lineChart;
    }

    /** Updates chart data during the DateRangePicker filtering operation */
    public updateChartData(): void {
        new DataManager(<JSON[]>this.app.dataSource).executeQuery(new Query()
        .where(this.predicate.and('TransactionType', 'equal', 'Expense')))
        .then((e: any) => {
            this.colChartExpenseData = this.dashService.getColumnChartExpenseDS(e);
        });
        new DataManager(<JSON[]>this.app.dataSource).executeQuery(new Query()
        .where(this.predicate.and('TransactionType', 'equal', 'Income')))
        .then((e: any) => {
            this.colChartIncomeData = this.dashService.getColumnChartIncomeDS(e);
            this.lineChartData = this.dashService.getLineChartDS();
        });
    }

    /** Performs fitlering and refreshes cards, chart and grid components based on the selected date ranges by using the DateRangePicker */
    public onDateRangeChange(args: RangeEventArgs): void {
        this.app.startDate = args.startDate;
        this.app.endDate = args.endDate;
        this.predicateStart = new Predicate('DateTime', 'greaterthanorequal', args.startDate);
        this.predicateEnd = new Predicate('DateTime', 'lessthanorequal', args.endDate);
        this.predicate = this.predicateStart.and(this.predicateEnd);
        this.cards.updateCardValues();
        this.pieChart.getTotalExpense();
        this.updateChartData();
        setTimeout(() => {
            this.pieChart.pie.refresh();
            this.lineChart.line.refresh();
            this.columnChart.colChart.refresh();
        }, 400);
        setTimeout(() => {
            this.pieChart.refreshPieChart();
        }, 1000);
    }
}