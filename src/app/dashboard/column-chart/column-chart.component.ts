import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';

import { ChartComponent, ILoadedEventArgs} from '@syncfusion/ej2-angular-charts';

import { DashBoardComponent } from '../dashboard.component';

@Component({
    selector: 'column-chart',
    templateUrl: 'column-chart.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ColumnChartComponent implements OnInit {
    @ViewChild('columnChart') colChart: ChartComponent;

    public lineObj: any;
    public marker: Object;
    public margin: Object;
    public cBorder: Object;
    public tooltip: Object;
    public titleStyle: Object;
    public incomeDS: any = [];
    public expenseDS: any = [];
    public primaryXAxis: Object;
    public primaryYAxis: Object;
    public legendSettings: Object;
    public initialRender: boolean = true;
    public animation: Object;

    constructor(public dashBoard: DashBoardComponent) {}

    public ngOnInit(): void {

        /** Configurations for the Column chart (Income vs Expense) component */
        this.primaryXAxis = {
            labelFormat: 'MMM',
            valueType: 'DateTime',
            intervalType: 'Months',
            edgeLabelPlacement: 'Shift'
        };
        this.primaryYAxis = {
            minimum: 3000,
            maximum: 9000,
            labelFormat: 'c0'
        };
        this.titleStyle = { textAlignment: 'Near', fontWeight: '500', size: '16', color: '#000' };
        this.legendSettings = { visible: true };
        this.tooltip = {
            fill: '#707070',
            enable: true,
            shared: true,
            format: '${series.name} : ${point.y}',
            header: 'Month - ${point.x} ',
        };
        this.marker = { visible: true, height: 10, width: 10 };
        this.margin = { top: 90 };
        this.cBorder = { width: 0.5, color: '#A16EE5' };
        this.animation = { enable: false };
    }

    public onChartLoaded(args: ILoadedEventArgs): void {
        if (this.initialRender) {
            this.initialRender = false;
            this.lineObj.line.refresh();
        } else {
            this.initialRender = false;
        }
    }
}