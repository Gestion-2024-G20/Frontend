import { Component, Inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Group } from '../../../../classes/group';
import { GroupService } from '../../../services/group.service';
import { BalanceService } from '../../../services/balance.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { lastValueFrom } from 'rxjs';
export interface DeleteGroupDialogData {
  title: string;
  content: string;
  value: string;
  groupId: number; 
  showError: boolean;
  msgError: string;  
}
@Component({
  selector: 'confirmDeleteGroup.component',
  templateUrl: 'confirmDeleteGroupDialog.component.html',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule]
})
export class ConfirmDeleteGroupDialogComponent {
  
  constructor(
    private groupService: GroupService,
    private balanceService: BalanceService,
    public dialogRef: MatDialogRef<ConfirmDeleteGroupDialogComponent>,
    private snackBarService: SnackbarService, 
    @Inject(MAT_DIALOG_DATA) public data: DeleteGroupDialogData) {}
    
    onNoClick(): void {
      this.data.value = ""; 
      this.dialogRef.close();
    }
    async onForceDelete(): Promise<void> {
      try{
      
          await lastValueFrom(this.groupService.deleteGroup(this.data.groupId)) as Group;
          this.snackBarService.open('Grupo eliminado', 'success');

          this.dialogRef.close("Ok");
    } catch (e) {
      this.dialogRef.close("Error deleting group: " + e);
    } 
  }

  async onRegularDelete(): Promise<void> {
    try{
    
        await lastValueFrom(this.groupService.markGroupAsDeleted(this.data.groupId)) as Group;
        this.snackBarService.open('El grupo se eliminará cuando ya no queden saldos pendientes', 'success');

        this.dialogRef.close("Ok");
  } catch (e) {
    this.dialogRef.close("Error deleting group: " + e);
  } 
}
}
