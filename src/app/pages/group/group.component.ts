import { Component, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Group } from '../../../classes/group';
import { GroupService } from '../../services/group.service';
import { lastValueFrom } from 'rxjs';
import { GroupMemberService } from '../../services/groupMembers.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { User } from '../../../classes/user';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../../classes/category';
import { CategoryShare } from '../../../classes/categoryShare';
import { GroupMember } from '../../../classes/groupMember';
import { SnackbarService } from '../../services/snackbar.service';
import { AddUserDialogComponent } from '../../components/addUserDialog/adduserDialog.component';
import { CategoryShareService } from '../../services/categoryShare.service';
import { AuthService } from '../../services/auth.service';
import { DeleteMemberDialogComponent } from '../../components/deleteMemberDialog/deleteMemberDialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import { MatCard } from '@angular/material/card';
import { MatCardHeader } from '@angular/material/card';
import { MatCardTitle } from '@angular/material/card';
import { MatCardContent } from '@angular/material/card';
import { ExpenditureService } from '../../services/expenditure.service';
import { Expenditure } from '../../../classes/expenditure';
import { AddExpenditureDialogComponent } from '../../components/addExpenditureDialog/addExpenditureDialog.component';


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
    MatCardContent
  ],
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  public userGroups: Array<Group> = [];
  public userGroupsIsAdmin: Array<boolean> = [];
  private id_group: number = -1;

  public loggedUserId: number = -1;
  public isAdmin: boolean = false;

  public group: Group = new Group();
  public groupMembers: Array<GroupMember> = [];

  public members: Array<User> = [];
  public admins: Array<User> = [];
  public totalmembers: Array<User> = [];

  public categories: Array<Category> = [];
  public expenditures: Array<Expenditure> = [];

  constructor(
    private userService: UserService,
    private groupService: GroupService, 
    private groupMemberService: GroupMemberService,
    private categoryService: CategoryService,
    private expenditureService: ExpenditureService,
    private categoryShareService: CategoryShareService,
    private authService: AuthService, 
    private snackBarService: SnackbarService, 
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
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
      const members = await lastValueFrom(this.groupMemberService.getGroupMembers(this.id_group)) as [GroupMember]
      this.groupMembers = members!;
      this.admins = new Array<User>;
      this.members = new Array<User>;
      for (const member of this.groupMembers) {
        const user: User = await lastValueFrom(this.userService.getUser(member.id_user)) as User;
        if (!user){
          throw Error("group member not found");
        }
        if (member.is_admin) {
          if (member.id_user == this.loggedUserId)
            this.isAdmin = true;
          this.admins.push(user);
        } else {
          this.members.push(user);
        }
      }
      this.totalmembers = this.admins.concat(this.members);
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
      const expenditures = await lastValueFrom(this.expenditureService.getGroupExpenditures(this.id_group));
      this.expenditures = expenditures!;
    } catch (error) {
      // TODO: handle error
      this.snackBarService.open("getExpenditures error: " + error, 'error');
    }
  }
  async refreshData(): Promise<void> {
    await this.getGroupData();
    await this.getMembersData();
    await this.getCategoriesData();
    await this.getExpendituresData();
  }

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const href = window.location.href;
      this.id_group = Number(href.split("/").pop()!);
    });
    this.loggedUserId = this.authService.loggedUserId();

    await this.refreshData();

  }


  async createCategory(formData: any): Promise<void> {
    try {

      let total_percentage = 0;
      // Obtengo datos para las categoryShares
      const newCategoryName = formData.newCategoryName;
      if (newCategoryName === "") {
        this.snackBarService.open("El nombre de la categoría no puede estar vacío", 'info');
        return;
      }
      const newCategoryDescription = formData.newCategoryDescription;
      if (newCategoryDescription === "") {
        this.snackBarService.open("La descripción de la categoría no puede estar vacía", 'info');
        return;
      }
      let newCategoryShares: Array<CategoryShare> = new Array<CategoryShare>;
      for (const key in formData) {
        if (!key.startsWith("percentage")) {
          continue;
        }
        const id_user = Number(key.replace("percentage", ""));
        
        let categoryShare = new CategoryShare();
        categoryShare.id_cs = 0; // se setea pero no se usa. Se genera uno nuevo en la base de datos. 
        categoryShare.id_user = id_user;
        categoryShare.share_percentage = Number(formData[key]);
        total_percentage += categoryShare.share_percentage;
        newCategoryShares.push(categoryShare as CategoryShare);
      }

      if (total_percentage !== 100) {
        this.snackBarService.open("El porcentaje total debe ser 100%", 'info');
        return;
      }

      // Creo la Category
      const newCategory = new Category();
      newCategory.name = newCategoryName;
      newCategory.description = newCategoryDescription;
      newCategory.id_group = this.id_group;
      let createdCategory = await lastValueFrom(this.categoryService.createCategory(newCategory)) as Category;
      console.log(newCategoryShares); 
      // Creo los CategoryShares
      for (const cs of newCategoryShares){
        cs.id_category = createdCategory.id_category; 
        await lastValueFrom(this.categoryShareService.createCategoryShare(cs as CategoryShare)) as CategoryShare;
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

  async addUser() : Promise<void> {
    let dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '250px',
      data: {title: "Add user to group", content: "Insert the username to add", showError: false, msgError:"", userIdRequestor: this.authService.loggedUserId()}
    });
    let user_id = await lastValueFrom(dialogRef.afterClosed());

    const newGroupMember = new GroupMember;
    newGroupMember.id_user = +user_id; 
    newGroupMember.id_group = this.id_group; 
    for (const member of this.totalmembers) {
      if (member.id_user == newGroupMember.id_user){
          this.snackBarService.open('Username already in group', 'info');
          return; 
        }
    }
    const groupMember = await lastValueFrom(this.groupMemberService.postGroupMember(newGroupMember)) as GroupMember;
    if (!groupMember) {
      this.snackBarService.open('Could not add user to group', 'error');
    }
    this.snackBarService.open('Added user to group', 'success');

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
    let groupMemberDeleteArray = await lastValueFrom(this.groupMemberService.getUserIdGroupIdGroupMembers(this.members[index].id_user, this.id_group)) as [GroupMember];
    console.log(groupMemberDeleteArray[0]);
    let groupMemberDelete = await lastValueFrom(this.groupMemberService.deleteGroupMember(groupMemberDeleteArray[0])) as GroupMember;
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

  goTo(){
    //this.router.navigate(['/group/config/' + this.userGroups[index].id_group]);
  }

  isAdminLoggedIn(){
    return 
  }
  

}