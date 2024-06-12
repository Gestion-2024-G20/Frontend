import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnChartComponent } from './columnChart.component';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  imports: [ColumnChartComponent, NgApexchartsModule],
  exports: [ColumnChartComponent]
})
export class ColumnChartModule { }
