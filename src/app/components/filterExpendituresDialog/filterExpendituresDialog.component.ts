import { Component, Inject, OnInit, importProvidersFrom} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { formatDate } from "@angular/common";
import { MatOptionModule } from '@angular/material/core';
import { Category } from '../../../classes/category';
import { User } from '../../../classes/user';


import { MatDatepickerModule } from '@angular/material/datepicker';



export interface FilterExpendituresDialogData {
  id_category: number; 
  categories: Array<Category>;
  members: Array<User>;
  id_member: number;
  min_date: Date;
  max_date: Date;
  min_date_str: string;
  max_date_str: string;
  msgError: string;  
  showError: boolean;
}
@Component({
  selector: 'filterExpendituresDialog.component',
  templateUrl: 'filterExpendituresDialog.component.html',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, 
    MatButtonModule, MatIconModule, MatOptionModule, MatSelectModule, MatDatepickerModule],
    
})
export class FilterExpendituresDialogComponent {
  
  constructor(
    public dialogRef: MatDialogRef<FilterExpendituresDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FilterExpendituresDialogData) {}
    
    onNoClick(): void {
      this.dialogRef.close();
    }
    async onClick(): Promise<void> {
      try { 
        if (this.data.min_date > this.data.max_date ){
          this.data.showError = true;
          this.data.msgError = "La fecha mínima no puede ser mayor a la máxima";
          return; 
        }
        const format = 'yyyy-MM-dd';
        const locale = 'en-US';
        if (this.data.min_date){
          this.data.min_date_str = formatDate(this.data.min_date, format, locale);
        }

        if (this.data.max_date){
          this.data.max_date_str = formatDate(this.data.max_date, format, locale);
        }
        this.dialogRef.close({id_user: this.data.id_member, id_category: this.data.id_category, 
          min_date: this.data.min_date_str, 
          max_date: this.data.max_date_str}); 
      } catch (e) {
        this.data.msgError = "Error filtrando los gastos";
        return; 
      } 

    }
}
