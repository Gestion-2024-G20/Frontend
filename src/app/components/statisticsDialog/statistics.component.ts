import { Component, Inject, Input, OnInit } from '@angular/core';
import { PieChartModule } from '../pieChart/pieChart.module';
import { StatisticsService } from '../../services/statistics.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../invitation-list-dialog/invitation-list-dialog.component';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {
  id_group: number = -1;
  statistics: any = {}
  constructor(private statisticsService: StatisticsService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<StatisticsComponent>
  ) { 
    this.id_group = data.id_group;
  }

  ngOnInit() {
    
    this.statisticsService.getStatistics(this.id_group).subscribe(statistics => {
      console.log(statistics);
      this.statistics = statistics;
    });
  }

}
