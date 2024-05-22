import { Component, Inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../../classes/user';
import { lastValueFrom } from 'rxjs';
export interface AddUserDialogData {
  title: string;
  content: string;
  value: string;
  showError: boolean;
  msgError: string;  
  userIdRequestor: number;
}
@Component({
  selector: 'addUserDialog.component',
  templateUrl: 'addUserDialog.component.html',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule]
})
export class AddUserDialogComponent {
  
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddUserDialogData) {}
    
    onNoClick(): void {
      this.data.value = ""; 
      this.dialogRef.close();
    }
    async onClick(): Promise<void> {
      if (!this.data.value){
        this.data.showError = true;
        this.data.msgError = "Must insert an username";
        return; 
      }

      console.log("la data que le llega al componente es: "+ this.data.value);
      let usersFound = await lastValueFrom(this.userService.getUserByUsername(this.data.value)) as User[];
      if (!usersFound || usersFound.length < 1) {
        this.data.showError = true;
        this.data.msgError = "Username not found";
        return; 
      }
      if (usersFound[0].id_user == this.data.userIdRequestor) {
        this.data.showError = true;
        this.data.msgError = "Cannot add yourself to the group";
        return; 
      }

      //Devuelvo al usuario que se ha insertado
      this.dialogRef.close(""+usersFound[0].username);
    }
}
