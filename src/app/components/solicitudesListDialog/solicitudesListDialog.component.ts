import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { lastValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { InvitationService } from '../../services/invitation.service';
import { Invitation } from '../../../classes/invitation';
import { User } from '../../../classes/user';
import { firstValueFrom } from 'rxjs';
import { RequestService } from '../../services/request.service';
import { GroupMember } from '../../../classes/groupMember';
import { AuthService } from '../../services/auth.service';
import { GroupMemberService } from '../../services/groupMembers.service';
import { SnackbarService } from '../../services/snackbar.service';



export interface DialogData {
  id_group: number
}

@Component({
  selector: 'app-solicitudesListDialog',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './solicitudesListDialog.component.html',
  styleUrl: './solicitudesListDialog.component.css'
})
export class SolicitudesListDialogComponent implements OnInit {
  users: User[] | null;
  

  constructor(private requestService: RequestService,
    private authService: AuthService, 
    private groupMemberService: GroupMemberService, 
    private snackBarService: SnackbarService, 
    private invitationService: InvitationService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<SolicitudesListDialogComponent>
  ) {
    this.users = [];
  }

  ngOnInit(): void {
    this.refreshData();
  }

  async refreshData(): Promise<void> {
    console.log("Entro al refreshData");
    this.users = await firstValueFrom(this.requestService.getUsersRequestedToGroup(this.data.id_group));
    console.log(this.users);
  }

  async acceptRequest(id_user: number): Promise<void> {
    let invitation = await firstValueFrom(this.requestService.getRequestByUserIdGroupId(id_user, this.data.id_group)) as Invitation;

    const groupMember = new GroupMember();
    groupMember.id_user = id_user;
    groupMember.id_group = invitation.id_group;
    groupMember.is_admin = false;
    const groupMemberCreated = await lastValueFrom(this.groupMemberService.postGroupMember(groupMember)) as GroupMember;
    if (!groupMemberCreated) {
      this.snackBarService.open('Could not join group', 'error');
      return;
    }
    this.snackBarService.open('Joined group', 'success');
    await lastValueFrom(this.invitationService.deleteInvitation(invitation.id_invitation));
    this.refreshData()
  }
  async rejectRequest(id_user: number): Promise<void> {

    //Necesito buscar la invitación filtrada por el id_user y por el id_group
    let invitacion = await firstValueFrom(this.requestService.getRequestByUserIdGroupId(id_user, this.data.id_group)) as Invitation;
    console.log(invitacion);
    await firstValueFrom(this.requestService.deleteRequest(invitacion.id_invitation));
    await this.refreshData();
  }
  
  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

  onClick(): void {
    console.log("Hola!");
    this.dialogRef.close();
  }
}
