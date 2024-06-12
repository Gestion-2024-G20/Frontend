import { NgModule } from '@angular/core';
import { PieChartComponent } from './pieChart.component';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  imports: [PieChartComponent, NgApexchartsModule],
  exports: [PieChartComponent]

})
export class PieChartModule { }
