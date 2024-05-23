import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ExpenditureService } from '../../../services/expenditure.service';
import { ExpenditureShareService } from '../../../services/expenditureShare.service';
import { CategoryShareService } from '../../../services/categoryShare.service';
import { Expenditure } from '../../../../classes/expenditure';
import { Category } from '../../../../classes/category';
import { lastValueFrom } from 'rxjs';
import { ExpenditureShare } from '../../../../classes/expenditureShare';
import { CategoryShare } from '../../../../classes/categoryShare';
export interface UpdateExpenditureDialogData {
  value: string; 
  amountString: string;
  amount: number;
  category_index: number; 
  description: string; 
  categories: Array<Category>;
  showAmountError: boolean;
  msgAmountError: string;  
  showCategorySelectError: boolean;
  msgCategorySelectError: string; 
  showDescriptionError: boolean;
  msgDescriptionError: string;  
  expenditure: Expenditure;
  userIdRequestor: number;
  groupId: number;
}
@Component({
  selector: 'updateExpenditureDialog.component',
  templateUrl: 'updateExpenditureDialog.component.html',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatOptionModule, MatSelectModule]
})
export class UpdateExpenditureDialogComponent {
  
  constructor(
    private expenditureService: ExpenditureService,
    private expenditureShareService: ExpenditureShareService,
    private categoryShareService: CategoryShareService,
    public dialogRef: MatDialogRef<UpdateExpenditureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UpdateExpenditureDialogData) {}
    onNoClick(): void {
      this.data.value = ""; 
      this.dialogRef.close();
    }
    async onClick(): Promise<void> {
      try { 
        console.log(this.data.amount)
        console.log(this.data.category_index)
        console.log(this.data.description)
        this.data.amount = +this.data.amountString; 
        if (!this.data.amount){
          this.data.showAmountError = true;
          this.data.msgAmountError = "Must insert an amount";
          return; 
        } else {
          this.data.showAmountError = false;
        }
        if (!this.data.category_index){
          this.data.showCategorySelectError = true;
          this.data.msgCategorySelectError = "Must insert a category";
          return; 
        } else {
          this.data.showCategorySelectError = false;
        }

        if (!this.data.description){
          this.data.showDescriptionError = true;
          this.data.msgDescriptionError = "Must insert a description";
          return; 
        } else {
          this.data.showDescriptionError = false;
        }


        let categorySharesFound = await lastValueFrom(this.categoryShareService.getCategoryCategoryShares(this.data.categories[this.data.category_index].id_category)) as CategoryShare[];
        if (!categorySharesFound || categorySharesFound.length <= 0){
          this.data.showDescriptionError = true;
          this.data.msgDescriptionError = "Error in fetching category shares";
          return; 
        } else {
          this.data.showDescriptionError = false;
        }
        let total_pct= 0; 
        let expenditure_shares: ExpenditureShare[] = []; 
        for (const cs of categorySharesFound){
          let expenditure_share = new ExpenditureShare; 
          expenditure_share.id_user = cs.id_user; 
          expenditure_share.share_percentage = cs.share_percentage; 
          total_pct += expenditure_share.share_percentage; 
          expenditure_shares.push(expenditure_share); 
        }
        if (total_pct != 100){
          this.data.showDescriptionError = true;
          this.data.msgDescriptionError = "Category shares percentage does not add up to 100";
          return; 
        } else {
          this.data.showDescriptionError = false;
        }
        
        let expenditure = new Expenditure;
        expenditure.amount = this.data.amount;  
        expenditure.description = this.data.description;  
        expenditure.id_user = this.data.userIdRequestor;  
        expenditure.id_group = this.data.groupId;  
        let expenditureCreated = await lastValueFrom(this.expenditureService.postExpenditure(expenditure)) as Expenditure;


        for (const es of expenditure_shares){
          es.id_expenditure = expenditureCreated.id_expenditure; 
          let expenditureShareCreated = await lastValueFrom(this.expenditureShareService.postExpenditureShare(es)) as ExpenditureShare;
        }

        this.dialogRef.close("Ok"); 
      } catch (e) {
        this.data.showDescriptionError = true;
        this.data.msgDescriptionError = "Error uploading expenditure";
        return; 
      } 

    }
}
