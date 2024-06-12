import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill,
  NgApexchartsModule
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
};

@Component({
  selector: 'app-column-chart',
  templateUrl: './columnChart.component.html',
  styleUrls: ['./columnChart.component.css'],
  standalone: true,
  imports: [NgApexchartsModule]
})
export class ColumnChartComponent {
  @Input() data: any = {};
  @Input() title: string = "Pie Chart"
  
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions>;

  constructor() {    
    this.chartOptions = {
      series: [],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      xaxis: {
        type: "category",
        categories: []
      },
      legend: {
        position: "right",
        offsetY: 40
      },
      fill: {
        opacity: 1
      }
    };
  }

  ngOnChanges(){
    const categories = Object.keys(this.data);
    const series: any = [];

    // Crear una lista de usuarios únicos
    const users = new Set<string>();
    categories.forEach(category => {
      const usersData = this.data[category];
      Object.keys(usersData).forEach(user => users.add(user));
    });

    // Inicializar la estructura de las series
    users.forEach(user => {
      series.push({
        name: user,
        data: categories.map(category => {
          const usersData = this.data[category];
          return usersData[user] || 0; // Si no hay dato para el usuario, se pone 0
        })
      });
    });

    this.chartOptions = {
      series: series,
      xaxis: {
        type: "category",
        categories: categories
      },
    }
    console.log(series, categories);
  }
}
