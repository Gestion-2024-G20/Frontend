import { Component, OnInit } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Group } from '../../../classes/group';
import { GroupService } from '../../services/group.service';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { GroupMemberService } from '../../services/groupMembers.service';
import { GroupMember } from '../../../classes/groupMember';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../services/snackbar.service';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ChangeGroupNameDialogComponent } from '../../components/changeGroupNameDialog/changeGroupNameDialog.component';
import { DeleteGroupDialogComponent } from '../../components/deleteGroupDialog/delete-group-dialog/deleteGroupDialog.component';
import { NewGroupDialogComponent } from '../../components/newGroupDialog/newGroupDialog.component';
import { Invitation } from '../../../classes/invitation';
import { InvitationService } from '../../services/invitation.service';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgFor,
    FormsModule,
    NgIf,
    RouterLink, 
    MatInputModule, 
    MatFormFieldModule,
    DatePipe,
  ],
  providers: [DatePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public userGroups: Array<Group> = [];
  public userGroupsIsAdmin: Array<boolean> = [];
  public groupName: string = "";
  public userInvitations: Array<Invitation> = [];
  public userRequests: Array<Invitation> = []; 

  constructor(
    private groupService: GroupService, 
    private authService: AuthService, 
    private groupMemberService: GroupMemberService, 
    private snackBarService: SnackbarService, 
    public dialog: MatDialog, 
    private router: Router,
    private invitationService: InvitationService,
    private requestService: RequestService,
    private datePipe: DatePipe
  ) { }

  async ngOnInit(): Promise<void> {
    this.refreshGroups();
    this.refreshInvitations();
    //console.log("User groups: ", this.userGroups);

  }

  async refreshInvitations() {
    this.userInvitations = [];
    this.userRequests = [];
    let userInvitations = await lastValueFrom(this.invitationService.getInvitationsByUserId(this.authService.loggedUserId())) as Array<Invitation> | null;
    let userRequests = await lastValueFrom(this.requestService.getRequestsByUserId(this.authService.loggedUserId())) as Array<Invitation> | null;
    if (userInvitations) {
      this.userInvitations.push(...userInvitations);
    } 

    if (userRequests) {
      this.userRequests.push(...userRequests);
    }

    return this.userInvitations;
  }

  async refreshGroups() {
    this.userGroups = [];
    console.log(this.authService.loggedUserId());
    // Obtengo todos los group_id a los que pertenece el user_id logueado 
    let userGroupMembers = await lastValueFrom(this.groupMemberService.getUserIdGroupMembers(this.authService.loggedUserId())) as Array<GroupMember>;
    if (!userGroupMembers || userGroupMembers.length < 1){
      return;
    }
    // busco los groups de los group_id encontrados
    for (let index = 0; index < userGroupMembers.length; index++) {
      this.userGroups.push(await lastValueFrom(this.groupService.getGroupById(userGroupMembers[index].id_group)) as Group);
      this.userGroupsIsAdmin.push(userGroupMembers[index].is_admin);
    }
  }

  async createGroup() {
    console.log("create group")

    const dialogRef = this.dialog.open(NewGroupDialogComponent, {
      width: '250px',
      data: {title: "Nuevo grupo", content: "Inserte el nombre del grupo", id_user_logged: this.authService.loggedUserId()}
    });
    const groupCreatedName = await lastValueFrom(dialogRef.afterClosed());
    console.log(groupCreatedName);
    
    if (groupCreatedName){
      this.snackBarService.open('Grupo \"' + groupCreatedName + '\" creado', 'success');
    }
    await this.refreshGroups();
  }

  async editGroupName(index:number): Promise<void> {
    const group = new Group(); 
    group.id_group = this.userGroups[index].id_group; 
    group.members_count = this.userGroups[index].members_count; 
    group.time_created = this.userGroups[index].time_created; 
    const dialogRef = this.dialog.open(ChangeGroupNameDialogComponent, {
      width: '250px',
      data: {title: "Editar nombre del grupo", content: "Inserte el nuevo nombre del grupo", groupToEdit: group}
    });
    const groupEditedName = await lastValueFrom(dialogRef.afterClosed());
    if (groupEditedName){
      this.snackBarService.open('Nombre del grupo actualizado', 'success');
    }
    this.refreshGroups()
  }
  async enterGroup(index:number): Promise<void> {
    if (this.authService.isAuth()) {
      this.router.navigate(['/group/' + this.userGroups[index].id_group]);
    }
  }


  async acceptInvitation(index:number): Promise<void> {
    const invitation = await lastValueFrom(this.invitationService.getInvitationById(index)) as Invitation;
    if (!invitation) {
      this.snackBarService.open('Invitación no encontrada', 'error');
      return;
    }
    const groupMember = new GroupMember();
    groupMember.id_user = this.authService.loggedUserId();
    groupMember.id_group = invitation.id_group;
    groupMember.is_admin = false;
    const groupMemberCreated = await lastValueFrom(this.groupMemberService.postGroupMember(groupMember)) as GroupMember;
    if (!groupMemberCreated) {
      this.snackBarService.open('No se pudo unirse al grupo', 'error');
      return;
    }
    this.snackBarService.open('Invitación aceptada', 'success');
    await lastValueFrom(this.invitationService.deleteInvitation(invitation.id_invitation));
    this.refreshGroups();
    this.refreshInvitations();
  }

  async rejectInvitation(index:number): Promise<void> {
    await lastValueFrom(this.invitationService.deleteInvitation(index));
    this.snackBarService.open('Invitación rechazada', 'success');
    this.refreshInvitations();
  }

  async cancelRequest(index:number): Promise<void> {
    await lastValueFrom(this.invitationService.deleteInvitation(index));
    this.snackBarService.open('Solicitud cancelada', 'success');
    this.refreshInvitations();
  }

  
  async deleteGroup(index:number): Promise<void> {
    try{
      console.log("delete group")
      const id_group = this.userGroups[index].id_group; 
      const dialogRef = this.dialog.open(DeleteGroupDialogComponent, {
        width: '250px',
        data: {title: "Eliminar grupo", content: "Estás seguro de querer eliminar el grupo?", groupId: id_group}
      });
      const response = await lastValueFrom(dialogRef.afterClosed());
      if (response && response != "Ok"){
        this.snackBarService.open(response, 'error');

        return;
      } else if (!response){
        return;
      }
      await this.refreshGroups();
    }
    catch(error){
      console.log("Entré al catch de deleteGroup!");
      this.snackBarService.open('' + error, 'error');
    }
  }

  transformDate(date: string) {
    return this.datePipe.transform(date.toString(), 'dd/MM/yyyy');
  }
}