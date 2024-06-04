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
import { RequestService } from '../../services/request.service';
import { Request } from '../../../classes/request';
import { SolicitudesListDialogComponent } from '../../components/solicitudesListDialog/solicitudesListDialog.component';
export interface MembersTableElement {
  id_user: number; 
  username: string;
  type: string;
  profilePhoto_filename: string;
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

  public totalToPay: number = 0;
  public totalToReceive: number = 0;
  invitationUrl: string = '';

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
    private invitationService: InvitationService,
    private requestService: RequestService

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
        let elm : MembersTableElement = {id_user: 0, username: "", type: "", profilePhoto_filename: ""};
        const user: User = await lastValueFrom(this.userService.getUser(member.id_user)) as User;
        if (!user){
          throw Error("group member not found");
        }
        elm.id_user = user.id_user;
        elm.username = user.username; 
        elm.profilePhoto_filename = user.profile_image_name; //Agrego el nombre de la imagen de foto de perfil
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
      this.totalToPay = 0; 
      this.totalToReceive = 0; 
      this.balancesUserLogged = await lastValueFrom(this.balanceService.getUserTotalBalances(this.id_group, this.loggedUserId)) as TotalBalances;
      
      for (const balance of this.balancesUserLogged.to_pay) {
        this.totalToPay += balance.amount;
      }
      for (const balance of this.balancesUserLogged.to_receive) {
        this.totalToReceive += balance.amount;
      }

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
        this.snackBarService.open('Se deben tener más de un miembro', 'error');
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


      this.snackBarService.open('Categoría creada', 'success');
      // Refresco la lista de categorias
      await this.refreshData();

    } catch (error) {
      this.snackBarService.open('' + error, 'error');
    }
  }

  async deleteCategory(category: Category): Promise<void> {
    try {
      const dialogRef = this.dialog.open(DeleteMemberDialogComponent, {
        width: '250px',
        data: {title: "Eliminar categoría", content: "Estás seguro que queres eliminar esta categoría?"}
      });

      const response = await lastValueFrom(dialogRef.afterClosed());
      //Si la respuesta es nula, entonces es porque cerré el dialog sin parámetros
      if (!response){
        return;
      }
      await lastValueFrom(this.categoryShareService.deleteCategoryCategoryShares(category.id_category));
      await lastValueFrom(this.categoryService.deleteCategory(category.id_category));
      
      this.snackBarService.open('Categoría eliminada', 'success');
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
      data: {title: "Invitar usuario al grupo", content: "Username ", showError: false, msgError:"", userIdRequestor: this.authService.loggedUserId()}
    });
    let username = await lastValueFrom(dialogRef.afterClosed());
    if (!username){
      //console.log("Entré acá!");
      return;
    }
    
    //console.log("El nombre es" + username);
    const user = await lastValueFrom(this.userService.getUserByUsername(username)) as User[] | null;
    if (!user){
      this.snackBarService.open('Username no encontrado', 'info');
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
          this.snackBarService.open('Ya se envió una invitación al usuario', 'info');
          return;
        }
      }
    }

    //Creo la invitación
    const invitation = new Invitation;
    invitation.id_user = user[0].id_user;
    invitation.id_group = this.id_group;
    invitation.status = "Pendiente";
    invitation.is_request = false;
    const createdInvitation = await lastValueFrom(this.invitationService.createInvitation(invitation)) as Invitation;
    if (!createdInvitation) {
      this.snackBarService.open('No se pudo añadir al usuario al grupo', 'error');
    }
    this.snackBarService.open('Se envió una invitación al usuario: ' + user[0].username + '', 'success');

    await this.refreshData();
  }

  async createRequestUrl(): Promise<void>{
    const token =  this.generateRandomToken(50);
    let url = "http://localhost:4200/request/" + this.id_group + "/" + token;
    this.invitationUrl = url;

    const request: Request = {
      id_request: 0,
      id_group: this.id_group,
      token,
      time_created: ''
    }
    const createdRequest = await lastValueFrom(this.requestService.createRequest(request)) as Request;
    if (!createdRequest) {
      this.snackBarService.open('No se pudo crear el link', 'error');
    }
    this.snackBarService.open('Link de ingreso creado!', 'success');
  }

  generateRandomToken(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }
  
    return result;
  }

  async deleteUser(index:number): Promise<void> {

    const dialogRef = this.dialog.open(DeleteMemberDialogComponent, {
      width: '250px',
      data: {title: "Eliminar miembro", content: "Estás seguro de querer eliminar este usuario?"}
    });
    const groupCreatedName = await lastValueFrom(dialogRef.afterClosed());
    if (!groupCreatedName){
      return;
    }

    let groupMemberDeleteArray = await lastValueFrom(this.groupMemberService.getUserIdGroupIdGroupMembers(index, this.id_group)) as [GroupMember];
    console.log(groupMemberDeleteArray[0]);

    let balanceUsuarioABorrar = await lastValueFrom(this.balanceService.getUserTotalBalances(this.id_group, index)) as TotalBalances;
    console.log(balanceUsuarioABorrar);
    //Chequeo que el usuario a borrar no tenga deudas con nadie ni nadie le deba nada
    if(balanceUsuarioABorrar.to_pay.length === 0  && balanceUsuarioABorrar.to_receive.length === 0){
      await lastValueFrom(this.groupMemberService.deleteGroupMember(groupMemberDeleteArray[0])) as GroupMember;
      this.snackBarService.open('Usuario eliminado', 'success');
      await this.refreshData();
      return;
    }
      
    //Necesito mandar un mensaje de que no se puede borrar el usuario porque tiene balances pendientes
    this.snackBarService.open('El usuario tiene balances pendientes', 'error');    
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
    this.snackBarService.open('Gasto creado', 'success');

    await this.refreshData();
  }
  async deleteExpenditure(expenditure: Expenditure): Promise<void> {
    try{
      console.log(expenditure);
      const dialogRef = this.dialog.open(DeleteExpenditureDialogComponent, {
        width: '250px',
        data: {title: "Eliminar gasto", content: "Estás seguro de querer eliminar el gasto?", expenditureId: expenditure.id_expenditure}
      });
      const response = await lastValueFrom(dialogRef.afterClosed());
      if (response && response != "Ok"){
        this.snackBarService.open(response, 'error');

        return;
      } else if (!response){
        return;
      }

      this.snackBarService.open('Gasto eliminado ', 'success');
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

    this.snackBarService.open('Invitaciones actualizadas', 'success');
    await this.refreshData();
  }

  async listadoSolicitudes(): Promise<void> {
    let dialogRef = this.dialog.open(SolicitudesListDialogComponent, {
      width: '500px', 
      data: {id_group: this.id_group}
    });
    let rsp = await lastValueFrom(dialogRef.afterClosed());
    if (!rsp){
      await this.refreshData();
      return;
    }

    this.snackBarService.open('Solicitudes actualizadas', 'success');
    await this.refreshData();
  }

  async leaveGroup(): Promise<void> {
    let groupMemberDeleteArray = await lastValueFrom(this.groupMemberService.getUserIdGroupIdGroupMembers(this.loggedUserId, this.id_group)) as [GroupMember];
    //Acá tengo que chequear que no tenga deudas pendientes
    let balanceUsuarioABorrar = await lastValueFrom(this.balanceService.getUserTotalBalances(this.id_group, this.loggedUserId)) as TotalBalances;
    if(balanceUsuarioABorrar.to_pay.length !== 0  || balanceUsuarioABorrar.to_receive.length !== 0){
      //Necesito mandar un mensaje de que no se puede borrar el usuario porque tiene balances pendientes
      this.snackBarService.open('Tenes saldos pendientes! Debes pagar tus deudas o recibir dinero.', 'error');
      return;
    }

    await lastValueFrom(this.groupMemberService.deleteGroupMember(groupMemberDeleteArray[0])) as GroupMember;
    this.snackBarService.open('Dejaste el grupo', 'success');
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