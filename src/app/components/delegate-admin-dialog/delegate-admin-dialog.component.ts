import { Component, Inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../../classes/user';
import { GroupMember } from '../../../classes';
import { lastValueFrom } from 'rxjs';
import { GroupMemberService } from '../../services/groupMembers.service';

export interface DialogData {
  id_user: number;
  id_group: number;
}

@Component({
  selector: 'app-delegate-admin-dialog',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './delegate-admin-dialog.component.html',
  styleUrl: './delegate-admin-dialog.component.css'
})
export class DelegateAdminDialogComponent {
  indexUser: number;

  constructor(private userService: UserService, private groupMemberService: GroupMemberService, public dialogRef: MatDialogRef<DelegateAdminDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.indexUser = 0;
  }

  onNoClick(): void {
    this.dialogRef.close("");
  }

  async onClick(): Promise<void> {
    console.log("Quiero buscar el miembro del grupo con los datos: " + this.data.id_user + " y " + this.data.id_group);
    let memberToUpdate = await lastValueFrom(this.groupMemberService.getUserIdGroupIdGroupMembers(this.data.id_user, this.data.id_group)) as [GroupMember];
    console.log(memberToUpdate[0])
    if (memberToUpdate.length > 0) {
      memberToUpdate[0].is_admin = true;
      await lastValueFrom(this.groupMemberService.putGroupMember(memberToUpdate[0]));

    } else {
      throw new Error('No se pudo encontrar el miembro del grupo');
    }
    this.dialogRef.close("Actualizar");
  }

}

