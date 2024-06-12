import { Component, Input, ViewChild } from '@angular/core'
import { ChartComponent, NgApexchartsModule } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pieChart.component.html',
  styleUrls: ['./pieChart.component.scss'],
  standalone: true,
  imports: [NgApexchartsModule]
})
export class PieChartComponent {
  @Input() data: any = {};
  @Input() title: string = "Pie Chart"

  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: Object.values(this.data),
      chart: {
        width: 100,
        type: "pie"
      },
      labels: Object.keys(this.data)
    };
  }

  ngOnChanges() {
    this.chartOptions = {
      series: Object.values(this.data),
      labels: Object.keys(this.data)
    }
  }
}
