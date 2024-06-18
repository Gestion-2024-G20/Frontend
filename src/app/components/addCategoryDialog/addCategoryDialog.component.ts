import { Component, Inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { Category } from '../../../classes/category';
import { CategoryShareService } from '../../services/categoryShare.service';
import { CategoryShare } from '../../../classes/categoryShare';
import { lastValueFrom, share } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import { User } from '../../../classes/user';
export interface AddCategoryDialogData {
  value: string; 
  name: string;
  description: string; 
  showError: boolean; 
  msgError: string; 
  groupId: number;
  totalMembers: User[]; 
  memberPercentage: string[]; 
}
@Component({
  selector: 'addCategoryDialog.component',
  templateUrl: 'addCategoryDialog.component.html',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatOptionModule, MatSelectModule]
})
export class AddCategoryDialogComponent {
  
  constructor(
    private categoryService: CategoryService,
    private categoryShareService: CategoryShareService,
    public dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddCategoryDialogData) {
      // this.data.memberPercentage = new Array<string>(this.data.totalMembers.length); 
    }
    async ngOnInit(): Promise<void> {
      this.data.memberPercentage = new Array<string>(this.data.totalMembers.length); 
    }

    onNoClick(): void {
      // devuelvo el string vacio
      this.data.value = ""; 
      this.dialogRef.close();
    }
    async onClick(): Promise<void> {
      try { 
        
        let total_percentage = 0;
        // Obtengo datos para las categoryShares
        const newCategoryName = this.data.name;
        const newCategoryDescription = this.data.description;
        if (!newCategoryName) {
          this.data.msgError = "El nombre de la categoría no puede estar vacío"; 
          this.data.showError = true; 
          return;
        } else if (!newCategoryDescription) {
          this.data.msgError = "La descripción de la categoría no puede estar vacía"; 
          this.data.showError = true; 
          return;
        } else {
          this.data.msgError = ""; 
          this.data.showError = false; 
        }
        let newCategoryShares: Array<CategoryShare> = new Array<CategoryShare>;
        for (let i = 0; i < this.data.totalMembers.length; i++) {

          let categoryShare = new CategoryShare();
          categoryShare.id_cs = 0; // se setea pero no se usa. Se genera uno nuevo en la base de datos. 
          categoryShare.id_user = this.data.totalMembers[i].id_user;
          
          // chequea que se ingreso solo numeros
          var reg = new RegExp('^[0-9]*$');
          if (!this.data.memberPercentage[i]) {
            this.data.msgError = "debe insertar los valores para todos los usuarios, aunque algunos sean 0."; 
            this.data.showError = true; 
            return;
          } else if (!reg.test(this.data.memberPercentage[i])){
            console.log(this.data.memberPercentage[i]); 
            this.data.msgError = "solo puede insertar números"; 
            this.data.showError = true; 
            return;
          } else {
            this.data.msgError = ""; 
            this.data.showError = false; 
          }
          categoryShare.share_percentage = Number(this.data.memberPercentage[i]);
          total_percentage += categoryShare.share_percentage;
          newCategoryShares.push(categoryShare as CategoryShare);
        }

        if (total_percentage !== 100) {
          this.data.msgError = "El porcentaje total debe ser 100%"; 
          this.data.showError = true; 
          return;
        } else {
          this.data.msgError = ""; 
          this.data.showError = false; 
        }

        // Creo la Category
        const newCategory = new Category();
        newCategory.name = newCategoryName;
        newCategory.description = newCategoryDescription;
        newCategory.id_group = this.data.groupId;
        let createdCategory = await lastValueFrom(this.categoryService.createCategory(newCategory)) as Category;
        console.log(newCategoryShares); 
        // Creo los CategoryShares
        for (const cs of newCategoryShares){
          cs.id_category = createdCategory.id_category; 
          await lastValueFrom(this.categoryShareService.createCategoryShare(cs as CategoryShare)) as CategoryShare;
        }

        //Necesito retornar la categoría creada
        this.dialogRef.close( createdCategory );
      } catch (e) {
        this.data.showError = true;
        this.data.msgError = "Error creando la categoría: " + e;
        return; 
      } 

    }
}
