import { Component, Inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Group } from '../../../../classes/group';
import { GroupService } from '../../../services/group.service';
import { BalanceService } from '../../../services/balance.service';
import { lastValueFrom } from 'rxjs';
import { ConfirmDeleteGroupDialogComponent } from '../../confirmDeleteGroupDialog/confirm-delete-group-dialog/confirmDeleteGroupDialog.component';
export interface DeleteGroupDialogData {
  title: string;
  content: string;
  value: string;
  groupId: number; 
  showError: boolean;
  msgError: string;  
}
@Component({
  selector: 'deleteGroupDialog.component',
  templateUrl: 'deleteGroupDialog.component.html',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule]
})
export class DeleteGroupDialogComponent {
  
  constructor(
    private groupService: GroupService,
    private balanceService: BalanceService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteGroupDialogData) {}
    
    onNoClick(): void {
      this.data.value = ""; 
      this.dialogRef.close();
    }
    async onClick(): Promise<void> {

      try{
        let balanceIsNull = await lastValueFrom(this.balanceService.balanceIsNull(this.data.groupId)) as number;
        console.log(balanceIsNull);
        if (balanceIsNull == 1){
          await lastValueFrom(this.groupService.deleteGroup(this.data.groupId)) as Group;

          this.dialogRef.close("Ok");
        } else{
          console.log('Balance not null');
          const dialogRef = this.dialog.open(ConfirmDeleteGroupDialogComponent, {
            width: '600px',
            data: {title: "El grupo contiene saldos pendientes", 
            groupId: this.data.groupId}
          });
          const response = await lastValueFrom(dialogRef.afterClosed());
          this.dialogRef.close(response);
        }

    } catch (e) {
      this.dialogRef.close("Error deleting group: " + e);
    } 
  }
}
