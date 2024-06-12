import { NgModule } from '@angular/core';
import { StatisticsComponent } from './statistics.component';
import { PieChartModule } from '../pieChart/pieChart.module';
import { MatIconModule } from '@angular/material/icon';
import { ColumnChartModule } from '../columnChart/columnChart.module';

@NgModule({
    declarations: [StatisticsComponent],
    imports: [PieChartModule, MatIconModule, ColumnChartModule],
    exports: [StatisticsComponent]

})
export class StatisticsModule { }
