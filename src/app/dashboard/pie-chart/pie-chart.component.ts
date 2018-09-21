import { Component, ViewEncapsulation, OnInit, ViewChild, HostListener } from '@angular/core';

import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { isNullOrUndefined as isNOU, Browser } from '@syncfusion/ej2-base';
import { IAccTextRenderEventArgs, IAccLoadedEventArgs, AccumulationChartComponent,
    IAccAnimationCompleteEventArgs } from '@syncfusion/ej2-angular-charts';

import { AppComponent } from '../../app.component';

@Component({
    selector: 'pie-chart',
    templateUrl: 'pie-chart.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PieChartComponent {
    @ViewChild('pie') pie: AccumulationChartComponent;
    @ViewChild('legendGrid') lGrid: GridComponent;

    public dataLabel: Object;
    public groupValue: string;
    public hiGridData: Object[];
    public expTotal: number = 0;
    public legendSettings: Object;
    public colorPalettes: Object[];
    public category: string[] = [];
    public tempData: IExpenseData[];
    public legendData: Object[] = [];
    public pieLegendData: Object[] = [];
    public pieRenderData: Object[] = [];
    public enableLegend: boolean = false;
    public pieRenderingData: Object[] = [];
    public animation: Object;
    public showWaitingPopup: boolean = false;

    constructor(public app: AppComponent) {}

    public ngOnInit(): void {

        /** Configurations for the Pie chart component */
        this.legendSettings = { visible: true };
        this.colorPalettes = ['#61EFCD', '#CDDE1F', '#FEC200', '#CA765A', '#2485FA', '#F57D7D', '#C152D2', '#8854D9', '#3D4EB8',
         '#00BCD7'];
        this.dataLabel = {
            name: 'x', visible: true,
            position: 'Outside', connectorStyle: { length: '10%' },
            font: { color: 'Black', size: '14px', fontFamily: 'Roboto' }
        };
        this.getTotalExpense();
        this.animation = { enable: false };
    }

    public ngAfterViewInit(): void {
        this.handleDataLabel();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
      /** Pie chart label disable at mobile mode handle at here */
      this.handleDataLabel();
    }

    public handleDataLabel(): void {
        if (Browser.isDevice || window.innerWidth < 400) {
            this.pie.series[0].dataLabel.visible = false;
        } else {
            this.pie.series[0].dataLabel.visible = true;
        }
    }

    /** Sets the pie chart's font size based on its size */
    public getFontSize(width: number): string {
        if (width > 300) {
            return '13px';
        } else if (width > 250) {
            return '8px';
        } else {
            return '6px';
        }
    }

    public onChartLoaded(args: IAccLoadedEventArgs): void {
        this.createLegendData('pie');
        this.enableLegend = true;
    }

    public onTextRender(args: IAccTextRenderEventArgs): void {
        args.series.dataLabel.font.size = this.getFontSize(this.pie.initialClipRect.width);
        this.pie.animateSeries = true;
        if (args.text.indexOf('Others') > -1) {
            args.text = 'Others';
        }
    }

    public onAnimateCompleted(args: IAccAnimationCompleteEventArgs): void {
        let element: HTMLElement = document.getElementById('total-expense_datalabel_Series_0');
        if (!isNOU(element)) { element.style.visibility = 'visible'; }
    }

    public getTotalExpense(): void {
        this.tempData = <IExpenseData[]> this.app.dataSource;
        this.expTotal = 0;
        this.category = [];
        this.legendData = [];
        let renderingData: { x: string; y: number; text: string; }[] = [];

        /** Extracts the category based data from the whole expense data */
        this.tempData.forEach((item: IExpenseData) => {
            if (item.TransactionType === 'Expense' && this.app.startDate.valueOf() <= item.DateTime.valueOf()
                && this.app.endDate.valueOf() >= item.DateTime.valueOf()) {
                this.expTotal += Number(item.Amount);
                this.legendData.push(item);
                if (this.category.indexOf(item.Category) < 0) {
                    this.category.push(item.Category);
                }
            }
        });

        /** From the category data, percentage calculation for legend grid */
        this.category.forEach((str: string) => {
            let total: number = 0;
            this.legendData.forEach((item: IExpenseData) => {
                if (str === item.Category) {
                    total += Number(item.Amount);
                }
            });
            let percent: string = ((total / this.expTotal) * 100).toFixed(2) + '%';
            renderingData.push({ x: str, y: total, text: percent });
        });

        /** Generates the pie chart data (pieRenderingData) */
        this.pieRenderingData = new DataManager(JSON.parse(JSON.stringify(renderingData)))
            .executeLocal((new Query().sortByDesc('y')));
        if (this.pieRenderingData.length > 10) {
            let temp: { x: string; y: number; text: string; } = <{ x: string; y: number; text: string; }>
                new DataManager(JSON.parse(JSON.stringify(renderingData))).executeLocal((new Query()
                    .sortByDesc('y').range(0, 9)))[8];
            this.groupValue = (temp.y - 1).toString();
            this.hiGridData = new DataManager(JSON.parse(JSON.stringify(renderingData)))
                .executeLocal((new Query().sortByDesc('y').skip(9)));
        } else {
            this.groupValue = null;
        }
    }

    public createLegendData(initiate: string): void {
        if (initiate === 'pieUpdate' || this.pieLegendData.length === 0) {
            this.pieLegendData = [];
            this.pieLegendData = this.pie.visibleSeries[0].points;
        }
        this.pie.legendSettings.visible = false;
         /** Generates the legend grid data (pieRenderData) */
        this.pieRenderData = [];
        for (let i: number = 0; i < this.pieLegendData.length; i++) {
            let data: { [k: string]: any } = this.pieLegendData[i];
            if (data.text.indexOf('Others') > -1) {
                data.x = ((data.y / this.expTotal) * 100).toFixed(2).toString() + '%';
            }
            this.pieRenderData.push(data);
        }
    }

    public onGridDataBound(args: Object): void {
        //this.pie.refresh();
        //this.lineChart.refresh();
        //this.columnChart.refresh();
        this.showWaitingPopup = false;
    }

    public onGridLoad(args: any): void {
        /** While the legend grid loads, it gets the data from pie chart and process to this */
        this.createLegendData('pie');
        this.showWaitingPopup = true;
    }

    public refreshPieChart(): void {
        this.getTotalExpense();
        this.createLegendData('pieUpdate');
        this.lGrid.refresh();
    }

    public updatePieChart(): void {
        let pieContainerObj: HTMLElement = document.getElementById('totalExpense');
        if (!isNOU(pieContainerObj) && pieContainerObj.offsetWidth < 480) {
            this.disableChartLabel();
        } else if (!isNOU(pieContainerObj) && pieContainerObj.offsetWidth > 480) {
            this.enableChartLabel();
        }
    }
    public disableChartLabel(): void {
        this.pie.series[0].dataLabel.visible = false;
        this.pie.refresh();
    }
    public enableChartLabel(): void {
        this.pie.series[0].dataLabel.visible = true;
        this.pie.refresh();
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