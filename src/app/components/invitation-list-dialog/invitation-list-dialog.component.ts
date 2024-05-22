import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { InvitationService } from '../../services/invitation.service';
import { Invitation } from '../../../classes/invitation';
import { User } from '../../../classes/user';
import { firstValueFrom } from 'rxjs';



export interface DialogData {
  id_group: number
}

@Component({
  selector: 'app-invitation-list-dialog',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './invitation-list-dialog.component.html',
  styleUrl: './invitation-list-dialog.component.css'
})
export class InvitationListDialogComponent implements OnInit {
  users: User[] | null;

  constructor(private invitationService: InvitationService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<InvitationListDialogComponent>
  ) {
    this.users = [];
  }

  ngOnInit(): void {
    this.refreshData();
  }

  async refreshData(): Promise<void> {
    console.log("Entro al refreshData");
    this.users = await firstValueFrom(this.invitationService.getUsersInvitedToGroup(this.data.id_group));
    console.log(this.users);
  }
  
  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

  onClick(): void {
    console.log("Hola!");
    this.dialogRef.close();
  }


  async rejectInvitation(id_user: number): Promise<void> {

    //Necesito buscar la invitación filtrada por el id_user y por el id_group
    let invitacion = await firstValueFrom(this.invitationService.getInvitationByUserIdGroupId(id_user, this.data.id_group)) as Invitation;
    console.log(invitacion);
    await firstValueFrom(this.invitationService.deleteInvitation(invitacion.id_invitation));
    await this.refreshData();
  }


}
