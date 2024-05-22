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
  msgDescriptionError: string;  
  showDescriptionError: boolean;
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
        const format = 'yyyy-MM-dd';
        const locale = 'en-US';
        this.dialogRef.close({id_user: this.data.id_member, id_category: this.data.id_category, 
          min_date: formatDate(this.data.min_date, format, locale), 
          max_date: formatDate(this.data.max_date, format, locale)}); 
      } catch (e) {
        this.data.msgDescriptionError = "Error filtering expenditures";
        return; 
      } 

    }
}
