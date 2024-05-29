import { Component, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Group } from '../../../classes/group';
import { GroupService } from '../../services/group.service';
import { lastValueFrom } from 'rxjs';
import { GroupMemberService } from '../../services/groupMembers.service';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { User } from '../../../classes/user';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../../classes/category';
import { GroupMember } from '../../../classes/groupMember';
import { SnackbarService } from '../../services/snackbar.service';
import { AddUserDialogComponent } from '../../components/addUserDialog/adduserDialog.component';
import { CategoryShareService } from '../../services/categoryShare.service';
import { AuthService } from '../../services/auth.service';
import { DeleteMemberDialogComponent } from '../../components/deleteMemberDialog/deleteMemberDialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatIconModule} from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource  } from '@angular/material/table';
import { MatCard } from '@angular/material/card';
import { MatCardHeader } from '@angular/material/card';
import { MatCardTitle } from '@angular/material/card';
import { MatCardContent } from '@angular/material/card';
import { ExpenditureService } from '../../services/expenditure.service';
import { Expenditure } from '../../../classes/expenditure';
import { AddExpenditureDialogComponent } from '../../components/addExpenditureDialog/addExpenditureDialog.component';
import { ListSharesDialogComponent } from '../../components/listSharesDialog/listSharesDialog.component';
import { UpdateExpenditureDialogComponent } from '../../components/updateExpenditureDialog/update-expenditure-dialog/updateExpenditureDialog.component';
import { DeleteExpenditureDialogComponent } from '../../components/deleteExpenditureDialog/delete-expenditure-dialog/deleteExpenditureDialog.component';
import { FilterExpendituresDialogComponent } from '../../components/filterExpendituresDialog/filterExpendituresDialog.component';
import { ExpendituresFilter } from '../../../classes/expendituresFilter';
import {MatExpansionModule} from '@angular/material/expansion';
import { InvitationListDialogComponent } from '../../components/invitation-list-dialog/invitation-list-dialog.component';
import { Invitation } from '../../../classes/invitation';
import { InvitationService } from '../../services/invitation.service';
import { AddCategoryDialogComponent } from '../../components/addCategoryDialog/addCategoryDialog.component';
import { TotalBalances } from '../../../classes/totalBalances';
import { BalanceService } from '../../services/balance.service';
export interface MembersTableElement {
  id_user: number; 
  username: string;
  type: string;
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgClass,
    NgFor,
    FormsModule,
    NgIf,
    RouterLink,
    FlexLayoutModule,
    MatIconModule,
    MatDialogModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent, 
    MatTableModule,
    MatExpansionModule
  ],
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  public userGroups: Array<Group> = [];
  public userGroupsIsAdmin: Array<boolean> = [];
  private id_group: number = -1;

  public loggedUserId: number = this.authService.loggedUserId();
  public isAdmin: boolean = false;

  public group: Group = new Group();
  public groupMembers: Array<GroupMember> = [];

  public members: Array<User> = [];
  public admins: Array<User> = [];
  public totalmembers: Array<User> = [];

  public categories: Array<Category> = [];
  public expenditures: Array<Expenditure> = [];

  public displayedColumnsMembers: string[] = ['username', 'type', 'actions'];
  public dataSourceMembers = new MatTableDataSource<MembersTableElement>([]);

  public expendituresFilter: ExpendituresFilter = new ExpendituresFilter;

  public balancesUserLogged: TotalBalances = new TotalBalances; 
  public balances: Array<TotalBalances> = new Array<TotalBalances>; 

  constructor(
    private userService: UserService,
    private groupService: GroupService, 
    private groupMemberService: GroupMemberService,
    private categoryService: CategoryService,
    private balanceService: BalanceService,
    private expenditureService: ExpenditureService,
    private categoryShareService: CategoryShareService,
    private authService: AuthService, 
    private snackBarService: SnackbarService, 
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private invitationService: InvitationService
  ) { }
  
  async getGroupData(): Promise<void> {
    try {
      const groupData = await lastValueFrom(this.groupService.getGroupById(this.id_group));
      this.group = groupData!;
    } catch (error) {
      // TODO: handle error
      this.router.navigateByUrl('/home');
    }
  }

  async getMembersData(): Promise<void> {
    // Get members data
    try {
      let arrayMembers = new Array;  
      const members = await lastValueFrom(this.groupMemberService.getGroupMembers(this.id_group)) as [GroupMember]
      this.groupMembers = members!;
      this.admins = new Array<User>;
      this.members = new Array<User>;
      for (const member of this.groupMembers) {
        let elm : MembersTableElement = {id_user: 0, username: "", type: ""};
        const user: User = await lastValueFrom(this.userService.getUser(member.id_user)) as User;
        if (!user){
          throw Error("group member not found");
        }
        elm.id_user = user.id_user;
        elm.username = user.username; 
        if (member.is_admin) {
          if (member.id_user == this.loggedUserId)
            this.isAdmin = true;
          this.admins.push(user);
          elm.type = "admin"; 
          arrayMembers.push(elm); 
        } else {
          elm.type = "member"; 
          this.members.push(user);
          arrayMembers.push(elm); 
        }
      }
      this.totalmembers = this.admins.concat(this.members);
      this.dataSourceMembers.data = arrayMembers; 
    } catch (error) {
      // TODO: handle error
      this.snackBarService.open('Unknown error retreiving members:' + error, 'error');
    }
  }

  async getCategoriesData(): Promise<void> {
    // Get categories data
    try {
      const categories = await lastValueFrom(this.categoryService.getGroupCategories(this.id_group));
      this.categories = categories!;
    } catch (error) {
      // TODO: handle error
      this.snackBarService.open("getCategories error: " + error, 'error');
    }
  }

  async getExpendituresData(): Promise<void> {
    // Get expenditures data
    try {
      this.expendituresFilter.id_group = this.id_group;
      const expenditures = await lastValueFrom(this.expenditureService.getGroupExpenditures(this.expendituresFilter));
      this.expenditures = expenditures!;
    } catch (error) {
      // TODO: handle error
      this.snackBarService.open("getExpenditures error: " + error, 'error');
    }
  }

  async getBalanceData(): Promise<void> {
    // Get balance data
    try {
      this.balancesUserLogged = await lastValueFrom(this.balanceService.getUserTotalBalances(this.id_group, this.loggedUserId)) as TotalBalances;
      for (let i = 0; i < this.totalmembers.length; i++) {
        const balances_obtained = await lastValueFrom(this.balanceService.getUserTotalBalances(this.id_group, this.totalmembers[i].id_user)) as TotalBalances;
        this.balances.push(balances_obtained);
      }
    } catch (error) {
      // TODO: handle error
      this.snackBarService.open("get Balance error: " + error, 'error');
    }
  }

  async refreshData(): Promise<void> {
    await this.getGroupData();
    await this.getMembersData();
    await this.getCategoriesData();
    await this.getExpendituresData();
    await this.getBalanceData();
  }

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const href = window.location.href;
      this.id_group = Number(href.split("/").pop()!);
    });
    this.loggedUserId = this.authService.loggedUserId();

    await this.refreshData();

  }


  async createCategory(): Promise<void> {
    try {

      if (this.totalmembers.length < 1){
        this.snackBarService.open('Must have more than 1 member', 'error');
        return;
      }
      
      let dialogRef = this.dialog.open(AddCategoryDialogComponent, {
        width: '25%',
        data: {showError: false, msgError: "", groupId: this.id_group, totalMembers: this.totalmembers}
      });

      // categoryDialogResponse va a tener un valor retornado por el dialogRef.close(returnParams) de AddCategoryDialogComponent
      let categoryDialogResponse = await lastValueFrom(dialogRef.afterClosed());

      // Aca se entra si toco "No thanks", lo que significa que se cerró el dialog sin parámetros
      if (!categoryDialogResponse){
        return;
      }


      this.snackBarService.open('Category created', 'success');
      // Refresco la lista de categorias
      await this.refreshData();

    } catch (error) {
      console.log("Entré al catch de createCategory!");
      this.snackBarService.open('' + error, 'error');
    }
  }

  async deleteCategory(category: Category): Promise<void> {
    try {
      const dialogRef = this.dialog.open(DeleteMemberDialogComponent, {
        width: '250px',
        data: {title: "Delete category", content: "Are you sure you want to delete this category?"}
      });

      const response = await lastValueFrom(dialogRef.afterClosed());
      //Si la respuesta es nula, entonces es porque cerré el dialog sin parámetros
      if (!response){
        return;
      }
      await lastValueFrom(this.categoryShareService.deleteCategoryCategoryShares(category.id_category));
      await lastValueFrom(this.categoryService.deleteCategory(category.id_category));
      
      this.snackBarService.open('Category deleted', 'success');
      await this.refreshData();
    } catch (error) {
      this.snackBarService.open('' + error, 'error');
    }

  }
  async detailCategory(category: Category): Promise<void> {
    try {
      let category_shares = await lastValueFrom(this.categoryShareService.getCategoryCategoryShares(category.id_category));
      if (!category_shares) {
        throw Error("not found category shares");
      }
      const dialogRef = this.dialog.open(ListSharesDialogComponent, {
        width: '250px',
        data: {category: category, category_shares: category_shares}
      });
      const response = await lastValueFrom(dialogRef.afterClosed());
      if (!response){
        return;
      }
    } catch (error) {
      this.snackBarService.open('' + error, 'error');
    }
  }
  async addUser() : Promise<void> {
    let dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '250px',
      data: {title: "Invite user to group", content: "Insert a username ", showError: false, msgError:"", userIdRequestor: this.authService.loggedUserId()}
    });
    let username = await lastValueFrom(dialogRef.afterClosed());
    if (!username){
      //console.log("Entré acá!");
      return;
    }
    
    //console.log("El nombre es" + username);
    const user = await lastValueFrom(this.userService.getUserByUsername(username)) as User[] | null;
    if (!user){
      this.snackBarService.open('Username not found', 'info');
      return;
    }

    //console.log(user[0].username);

    let objetoUser = user[0];
    //Obtengo las invitaciones cuyo id de grupo coincida con el id del grupo
    const invitaciones = await lastValueFrom(this.invitationService.getInvitationsByGroupId(this.id_group)) as Invitation[] | null;

    //Ahora quiero ver si existe una invitación con ese id de usuario (quiero usar objetoUser.id_user)

    if (invitaciones){
      for (const i of invitaciones){
        if (i.id_user === objetoUser.id_user){
          this.snackBarService.open('An invitation has already been sent to this user', 'info');
          return;
        }
      }
    }

    //Creo la invitación
    const invitation = new Invitation;
    invitation.id_user = user[0].id_user;
    invitation.id_group = this.id_group;
    invitation.status = "Pendiente";
    const createdInvitation = await lastValueFrom(this.invitationService.createInvitation(invitation)) as Invitation;
    if (!createdInvitation) {
      this.snackBarService.open('Could not add user to group', 'error');
    }
    this.snackBarService.open('An invitation has been sent to user ' + user[0].username + '', 'success');

    await this.refreshData();

  }

  async deleteUser(index:number): Promise<void> {

    const dialogRef = this.dialog.open(DeleteMemberDialogComponent, {
      width: '250px',
      data: {title: "Delete member", content: "Are you sure you want to delete this member?"}
    });
    const groupCreatedName = await lastValueFrom(dialogRef.afterClosed());
    if (!groupCreatedName){
      return;
    }

    let groupMemberDeleteArray = await lastValueFrom(this.groupMemberService.getUserIdGroupIdGroupMembers(index, this.id_group)) as [GroupMember];
    console.log(groupMemberDeleteArray[0]);
    let groupMemberDelete = await lastValueFrom(this.groupMemberService.deleteGroupMember(groupMemberDeleteArray[0])) as GroupMember;
    //Acá debería actualizar los porcentajes de las categorías donde el usuario era miembro

    console.log(groupMemberDelete);
    this.snackBarService.open('User deleted', 'success');
    await this.refreshData();

  }

  async createExpenditure() : Promise<void> {
    let dialogRef = this.dialog.open(AddExpenditureDialogComponent, {
      width: '500px', 
      data: {categories: this.categories, userIdRequestor: this.authService.loggedUserId(), groupId: this.id_group}
    });
    let rsp = await lastValueFrom(dialogRef.afterClosed());
    if (!rsp){
      return;
    }
    this.snackBarService.open('Expenditure created', 'success');

    await this.refreshData();
  }
  async deleteExpenditure(expenditure: Expenditure): Promise<void> {
    try{
      console.log(expenditure);
      const dialogRef = this.dialog.open(DeleteExpenditureDialogComponent, {
        width: '250px',
        data: {title: "Delete expenditure", content: "Are you sure you want to delete this expenditure?", expenditureId: expenditure.id_expenditure}
      });
      const response = await lastValueFrom(dialogRef.afterClosed());
      if (response && response != "Ok"){
        this.snackBarService.open(response, 'error');

        return;
      } else if (!response){
        return;
      }

      this.snackBarService.open('Expenditure deleted ', 'success');
      await this.refreshData();
    }
    catch(error){
      console.log("Entré al catch de deleteExpenditure!");
      this.snackBarService.open('' + error, 'error');
    }
  }
  async updateExpenditure(expenditure: Expenditure): Promise<void> {
    let dialogRef = this.dialog.open(UpdateExpenditureDialogComponent, {
      width: '500px', 
      data: {categories: this.categories, userIdRequestor: this.authService.loggedUserId(), groupId: this.id_group, expenditure: expenditure}
    });
    let rsp = await lastValueFrom(dialogRef.afterClosed());
    if (!rsp){
      return;
    }
    await this.refreshData();
  }
  async listadoInvitados(): Promise<void> {
    let dialogRef = this.dialog.open(InvitationListDialogComponent, {
      width: '500px', 
      data: {id_group: this.id_group}
    });
    let rsp = await lastValueFrom(dialogRef.afterClosed());
    if (!rsp){
      return;
    }

    this.snackBarService.open('Expenditure updated', 'success');
    await this.refreshData();
  }

  async leaveGroup(): Promise<void> {
    let groupMemberDeleteArray = await lastValueFrom(this.groupMemberService.getUserIdGroupIdGroupMembers(this.loggedUserId, this.id_group)) as [GroupMember];
    await lastValueFrom(this.groupMemberService.deleteGroupMember(groupMemberDeleteArray[0])) as GroupMember;
    this.snackBarService.open('You left the group', 'success');
    await this.refreshData();
    this.router.navigate(['/home']);
  }

  async filterExpenditures() : Promise<void> {
    let dialogRef = this.dialog.open(FilterExpendituresDialogComponent, {
      width: '500px', 
      data: {categories: this.categories, members:this.totalmembers}
    });
    let rsp = await lastValueFrom(dialogRef.afterClosed());
    if (!rsp){
      return;
    }
    this.expendituresFilter.id_category = rsp.id_category;
    this.expendituresFilter.id_user = rsp.id_user;
    this.expendituresFilter.min_date = rsp.min_date;
    this.expendituresFilter.max_date = rsp.max_date;

    await this.refreshData();
  }


  goTo(){
    //this.router.navigate(['/group/config/' + this.userGroups[index].id_group]);
  }

  isAdminLoggedIn(){
    return 
  }


  

}