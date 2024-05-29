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
import { Group } from '../../../classes/group';
import { GroupService } from '../../services/group.service';
import { GroupMember } from '../../../classes/groupMember';
import { GroupMemberService } from '../../services/groupMembers.service';
export interface NewGroupDialogData {
  title: string;
  content: string;
  value: string;
  showError: boolean;
  msgError: string;  
  id_user_logged: number;
  description: string;
}
@Component({
  selector: 'newGroupDialog.component',
  templateUrl: 'newGroupDialog.component.html',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule]
})
export class NewGroupDialogComponent {
  
  constructor(
    private userService: UserService,
    private groupService: GroupService, 
    private groupMemberService: GroupMemberService, 
    public dialogRef: MatDialogRef<NewGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewGroupDialogData) {}
    
    onNoClick(): void {
      this.data.value = ""; 
      this.dialogRef.close();
    }
    async onClick(): Promise<void> {
      if (!this.data.value){
        this.data.showError = true;
        this.data.msgError = "Must insert a group name";
        return; 
      }
      const group = new Group();
      group.name = this.data.value; 
      group.description = this.data.description;
      // Creo un nuevo grupo
      const groupCreated = await lastValueFrom(this.groupService.postGroup(group)) as Group;
      const groupMember = new GroupMember();
      groupMember.id_group = groupCreated.id_group; 
      groupMember.id_user = this.data.id_user_logged; 
      groupMember.is_admin = true;
  
      if (!groupCreated) {
        this.data.showError = true;
        this.data.msgError = "Unknown error in group created. Try again later";
        return; 
      }
      // Creo una nueva relacion groupMember para ese grupo
      const groupMemberCreated = await lastValueFrom(this.groupMemberService.postGroupMember(groupMember)) as GroupMember;

      if (!groupMemberCreated) {
        // await lastValueFrom(this.groupService.delete(group)) as Group;
        this.data.showError = true;
        this.data.msgError = "Unknown error in group member created. Try again later";
        return; 
      }

      this.dialogRef.close(groupCreated.name);
    }
}
