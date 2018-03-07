import { Injectable } from '@angular/core';

import { extend } from '@syncfusion/ej2-base';

import { CommonService } from '../common/common.service';
import { userInfo } from '../common/common.data';

@Injectable()
export class DashBoardService {
    public name: string;
    public lineD: any = [];
    public lineDS: any = [];
    public curDateTime: any;
    public tempLineDS: any = {};
    public colIncomeDS: any = [];
    public colExpenseDS: any = [];
    public tempIncomeDS: any = {};
    public tempExpenseDS: any = {};

    constructor(public common: CommonService) {
        this.name = userInfo.FirstName;
    }

    public getName(): string {
        return this.name;
    }

    public getColumnChartIncomeDS(e: any): Object[] {
        this.colIncomeDS = [];
        this.tempIncomeDS = [];
        let result: Object[] = this.common.objectAssign(e);
        for (let i: number = 0; i < result.length; i++) {
            let cur: any = result[i];
            if (cur.DateTime.getMonth() in this.tempIncomeDS) {
                this.curDateTime = this.tempIncomeDS[cur.DateTime.getMonth()];
                this.tempIncomeDS[cur.DateTime.getMonth()].Amount = parseInt(this.curDateTime.Amount, 0) + parseInt(cur.Amount, 0);
            } else {
                this.tempIncomeDS[cur.DateTime.getMonth()] = cur;
                this.tempIncomeDS[cur.DateTime.getMonth()].DateTime = new Date(new Date(this.tempIncomeDS[cur.DateTime.getMonth()].DateTime.setHours(0, 0, 0, 0)).setDate(1));
            }
        }
        for (let data in this.tempIncomeDS) {
            this.colIncomeDS.push(this.tempIncomeDS[data]);
        }
        return this.colIncomeDS;
    }

    public getColumnChartExpenseDS(e: any): Object[] {
        this.colExpenseDS = [];
        this.tempExpenseDS = [];
        let result: Object[] = this.common.objectAssign(e);
        for (let i: number = 0; i < result.length; i++) {
            let cur: any = result[i];
            if (cur.DateTime.getMonth() in this.tempExpenseDS) {
                this.curDateTime = this.tempExpenseDS[cur.DateTime.getMonth()];
                this.tempExpenseDS[cur.DateTime.getMonth()].Amount = parseInt(this.curDateTime.Amount, 0) + parseInt(cur.Amount, 0);
            } else {
                this.tempExpenseDS[cur.DateTime.getMonth()] = cur;
                this.tempExpenseDS[cur.DateTime.getMonth()].DateTime = new Date(new Date(this.tempExpenseDS[cur.DateTime.getMonth()].DateTime.setHours(0, 0, 0, 0)).setDate(1));
            }
        }
        for (let data in this.tempExpenseDS) {
            this.colExpenseDS.push(this.tempExpenseDS[data]);
        }
        return this.colExpenseDS;
    }

    public getLineChartDS(): Object[] {
        this.lineD = [];
        this.lineDS = [];
        this.tempLineDS = [];
        let result: Object[] = [];
        let obj: any;
        obj = extend(obj, (this.colIncomeDS.concat(this.colExpenseDS)), {}, true);
        for (let data: number = 0; data < Object.keys((this.colIncomeDS.concat(this.colExpenseDS))).length; data++) {
            result.push(obj[data]);
        }
        this.tempLineDS = result;
        for (let i: number = 0; i < this.tempLineDS.length; i++) {
            let cur: any = this.tempLineDS[i];
            if (cur.DateTime.getMonth() in this.lineD) {
                this.curDateTime = this.lineD[cur.DateTime.getMonth()];
                this.lineD[cur.DateTime.getMonth()].Amount = Math.abs((parseInt(this.curDateTime.Amount, 0) - parseInt(cur.Amount, 0)));
            } else {
                this.lineD[cur.DateTime.getMonth()] = cur;
            }
        }
        for (let data: number = 0; data <= this.lineD.length; data++) {
            if (this.lineD[data]) {
                this.lineDS.push(this.lineD[data]);
            }
        }
        return this.lineDS;
    }
}