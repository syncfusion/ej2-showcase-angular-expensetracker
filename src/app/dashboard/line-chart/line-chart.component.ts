import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';

import { ChartComponent } from '@syncfusion/ej2-angular-charts';

import { DashBoardComponent } from '../dashboard.component';

@Component({
    selector: 'line-chart',
    templateUrl: 'line-chart.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LineChartComponent implements OnInit {
    @ViewChild('lineChart') line: ChartComponent;

    public marker: Object;
    public margin: Object;
    public tooltip: Object;
    public lBorder: Object;
    public lineDS: any = [];
    public crossHair: Object;
    public chartArea: Object;
    public dataSource: Object;
    public primaryXAxis: Object;
    public primaryYAxis: Object;
    public animation: Object;

    constructor(public dashBoard: DashBoardComponent) {}

    public ngOnInit(): void {

        /** Configurations for the Line chart component */
        this.primaryXAxis = {
            valueType: 'DateTime',
            labelFormat: 'MMM',
            majorGridLines: { width: 0 },
            intervalType: 'Months'
        };
        this.primaryYAxis = {
            maximum: 1800,
            interval: 300,
            labelFormat: 'c0'
        };
        this.tooltip = {
            fill: '#707070',
            enable: true,
            shared: true,
            format: '${series.name} : ${point.y}',
            header: 'Month - ${point.x} '
        };
        this.chartArea = {
            border: { width: 0 }
        };
        this.margin = { top: 90 };
        this.lBorder = { width: 0.5, color: '#0470D8' };
        this.marker = {
            visible: true,
            width: 10,
            height: 10,
            fill: 'white',
            border: { width: 2, color: '#0470D8' },
        };
        this.animation = { enable: false };
    }
}