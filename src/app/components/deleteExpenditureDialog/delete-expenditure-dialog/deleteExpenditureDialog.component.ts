import { Component, Inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Expenditure } from '../../../../classes/expenditure';
import { ExpenditureService } from '../../../services/expenditure.service';
import { ExpenditureShareService } from '../../../services/expenditureShare.service';
import { lastValueFrom } from 'rxjs';
export interface DeleteExpenditureDialogData {
  title: string;
  content: string;
  value: string;
  expenditureId: number; 
  showError: boolean;
  msgError: string;  
}
@Component({
  selector: 'deleteExpenditureDialog.component',
  templateUrl: 'deleteExpenditureDialog.component.html',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule]
})
export class DeleteExpenditureDialogComponent {
  
  constructor(
    private expenditureService: ExpenditureService,
    public dialogRef: MatDialogRef<DeleteExpenditureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteExpenditureDialogData) {}
    
    onNoClick(): void {
      this.data.value = ""; 
      this.dialogRef.close();
    }
    async onClick(): Promise<void> {

      try{
            
      let expenditureCreated = await lastValueFrom(this.expenditureService.deleteExpenditure(this.data.expenditureId)) as Expenditure;

      this.dialogRef.close("Ok");

    } catch (e) {
      this.dialogRef.close("Error deleting Expenditure: " + e);
    } 
  }
}
